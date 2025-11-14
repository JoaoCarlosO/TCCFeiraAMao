from flask import render_template, request, redirect, url_for, flash, session
from models.database import db, Vendedor, Feiras, MensagemSuporte
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
import logging

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def init_app(app):
    
    # ========== MIDDLEWARE ==========
    @app.before_request
    def before_request():
        """Verifica autenticação antes de cada requisição"""
        public_routes = ['home', 'login', 'sobre', 'suporte', 'static', 'logout', 'cadastrar_vendedor']
        
        if request.endpoint and request.endpoint not in public_routes:
            if 'user_id' not in session or session.get('user_type') != 'vendedor':
                flash('Faça login como vendedor para acessar esta página.', 'error')
                return redirect(url_for('login'))

    # ========== ROTAS PÚBLICAS ==========
    @app.route('/')
    def home():
        """Página inicial pública"""
        return render_template('home.html')

    @app.route('/sobre')
    def sobre():
        """Página sobre o sistema"""
        return render_template('sobre.html')

    @app.route('/suporte', methods=['GET', 'POST'])
    def suporte():
        """Página de suporte"""
        if request.method == 'POST':
            try:
                Nome = request.form.get('Nome')
                Email = request.form.get('Email')
                mensagem = request.form.get('mensagem')

                if not all([Nome, Email, mensagem]):
                    flash('Por favor, preencha todos os campos.', 'error')
                    return render_template('suporte.html')

                nova_msg = MensagemSuporte(
                    Nome=Nome, 
                    Email=Email, 
                    mensagem=mensagem
                )
                
                db.session.add(nova_msg)
                db.session.commit()
                flash('Mensagem enviada com sucesso! Obrigado pelo contato.', 'success')
                return redirect(url_for('suporte'))
                
            except Exception as e:
                db.session.rollback()
                logger.error(f"Erro no suporte: {e}")
                flash(f'Erro ao enviar mensagem: {str(e)}', 'error')

        return render_template('suporte.html')

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        """Página de login"""
        if request.method == 'POST':
            Email = request.form.get('Email', '').strip()
            Senha = request.form.get('Senha', '').strip()
            
            print(f"🔍 TENTANDO LOGIN: {Email} / {Senha}")
            
            vendedor = Vendedor.query.filter_by(Email=Email).first()
            if vendedor:
                print(f"✅ VENDEDOR ENCONTRADO: {vendedor.Nome}")
                print(f"🔐 SENHA NO BANCO: {vendedor.Senha}")
                
                if check_password_hash(vendedor.Senha, Senha):
                    print("🎯 SENHA CORRETA!")
                    # Login bem sucedido
                    session['user_id'] = vendedor.IdVend
                    session['user_type'] = 'vendedor'
                    session['user_name'] = vendedor.Nome
                    session['vendedor_id'] = vendedor.IdVend
                    flash(f'Bem-vindo, {vendedor.Nome}!', 'success')
                    return redirect(url_for('homeVend'))
                else:
                    print("❌ SENHA INCORRETA!")
                    flash('Senha incorreta.', 'error')
            else:
                print("❌ VENDEDOR NÃO ENCONTRADO!")
                flash('Vendedor não encontrado.', 'error')
        
        return render_template('login.html')

    @app.route('/logout')
    def logout():
        """Logout do usuário"""
        session.clear()
        flash('Logout realizado com sucesso!', 'success')
        return redirect(url_for('home'))

    @app.route('/cadastrar-vendedor', methods=['GET', 'POST'])
    def cadastrar_vendedor():
        """Cadastro de novos vendedores"""
        if request.method == 'POST':
            try:
                Nome = request.form.get('Nome')
                Barraca = request.form.get('Barraca')
                Email = request.form.get('Email')
                CPFCNPJ = request.form.get('CPFCNPJ')
                Telefone = request.form.get('Telefone')
                Senha = request.form.get('Senha')
                ConfirmarSenha = request.form.get('ConfirmarSenha')

                # Validações
                if not all([Nome, Barraca, Email, CPFCNPJ, Telefone, Senha]):
                    flash('Por favor, preencha todos os campos.', 'error')
                    return render_template('cadastrar_vendedor.html')

                if Senha != ConfirmarSenha:
                    flash('As senhas não coincidem.', 'error')
                    return render_template('cadastrar_vendedor.html')

                if Vendedor.query.filter_by(Email=Email).first():
                    flash('Este email já está cadastrado.', 'error')
                    return render_template('cadastrar_vendedor.html')

                # Criar novo vendedor
                novo_vendedor = Vendedor(
                    Nome=Nome,
                    Barraca=Barraca,
                    Email=Email,
                    CPFCNPJ=CPFCNPJ,
                    Telefone=Telefone,
                    IdCli=None
                )
                novo_vendedor.set_password(Senha)

                db.session.add(novo_vendedor)
                db.session.commit()

                flash('Cadastro realizado com sucesso! Faça login para continuar.', 'success')
                return redirect(url_for('login'))

            except Exception as e:
                db.session.rollback()
                logger.error(f"Erro no cadastro: {e}")
                flash(f'Erro ao cadastrar: {str(e)}', 'error')

        return render_template('cadastrar_vendedor.html')

    # ========== ROTAS PROTEGIDAS (VENDEDOR) ==========
    @app.route('/homeVend')
    def homeVend():
        """Home do vendedor"""
        if 'user_id' not in session or session.get('user_type') != 'vendedor':
            return redirect(url_for('login'))

        try:
            vendedor = Vendedor.query.get(session['vendedor_id'])
            feiras = Feiras.query.filter_by(IdVend=session['vendedor_id']).all()

            return render_template('homeVend.html',
                                vendedor=vendedor,
                                feiras=feiras)
        except Exception as e:
            logger.error(f"Erro no homeVend: {e}")
            return render_template('homeVend.html',
                                vendedor=None,
                                feiras=[])

    @app.route('/cadastrar-feiras', methods=['GET', 'POST'])
    def cadastrar_feiras():
        """Cadastro de novas feiras"""
        if 'user_id' not in session or session.get('user_type') != 'vendedor':
            flash('Faça login como vendedor para cadastrar feiras.', 'error')
            return redirect(url_for('login'))
        
        if request.method == 'POST':
            try:
                nome_feira = request.form.get('nome_feira')
                localizacao = request.form.get('localizacao')
                dias_funcionamento = request.form.get('dias_funcionamento')
                horario_funcionamento = request.form.get('horario_funcionamento')
                
                if not all([nome_feira, localizacao]):
                    flash('Por favor, preencha todos os campos obrigatórios.', 'error')
                    return render_template('cadastrar_feiras.html')
                
                # Associa a feira ao vendedor logado
                nova_feira = Feiras(
                    NomeFeira=nome_feira,
                    Localizacao=localizacao,
                    DiasFuncionamento=dias_funcionamento,
                    HorarioFuncionamento=horario_funcionamento,
                    IdVend=session['vendedor_id']
                )
                
                db.session.add(nova_feira)
                db.session.commit()
                
                flash('Feira cadastrada com sucesso!', 'success')
                return redirect(url_for('homeVend'))
                
            except Exception as e:
                db.session.rollback()
                logger.error(f"Erro ao cadastrar feira: {e}")
                flash(f'Erro ao cadastrar feira: {str(e)}', 'error')
        
        return render_template('cadastrar_feiras.html')

    @app.route('/minhas-feiras')
    def minhas_feiras():
        """Lista de feiras do vendedor"""
        if 'user_id' not in session or session.get('user_type') != 'vendedor':
            return redirect(url_for('login'))

        try:
            feiras = Feiras.query.filter_by(IdVend=session['vendedor_id']).all()
            return render_template('minhas_feiras.html', feiras=feiras)
        except Exception as e:
            logger.error(f"Erro em minhas_feiras: {e}")
            flash('Erro ao carregar feiras.', 'error')
            return render_template('minhas_feiras.html', feiras=[])

    @app.route('/editar-feira/<int:id>', methods=['GET', 'POST'])
    def editar_feira(id):
        """Editar feira existente"""
        if 'user_id' not in session or session.get('user_type') != 'vendedor':
            return redirect(url_for('login'))

        feira = Feiras.query.filter_by(IdFeira=id, IdVend=session['vendedor_id']).first()
        
        if not feira:
            flash('Feira não encontrada.', 'error')
            return redirect(url_for('minhas_feiras'))

        if request.method == 'POST':
            try:
                feira.NomeFeira = request.form.get('nome_feira')
                feira.Localizacao = request.form.get('localizacao')
                feira.DiasFuncionamento = request.form.get('dias_funcionamento')
                feira.HorarioFuncionamento = request.form.get('horario_funcionamento')
                
                db.session.commit()
                flash('Feira atualizada com sucesso!', 'success')
                return redirect(url_for('minhas_feiras'))
                
            except Exception as e:
                db.session.rollback()
                logger.error(f"Erro ao editar feira: {e}")
                flash(f'Erro ao editar feira: {str(e)}', 'error')

        return render_template('editar_feira.html', feira=feira)

    @app.route('/excluir-feira/<int:id>')
    def excluir_feira(id):
        """Excluir feira"""
        if 'user_id' not in session or session.get('user_type') != 'vendedor':
            return redirect(url_for('login'))

        feira = Feiras.query.filter_by(IdFeira=id, IdVend=session['vendedor_id']).first()
        
        if feira:
            try:
                db.session.delete(feira)
                db.session.commit()
                flash('Feira excluída com sucesso!', 'success')
            except Exception as e:
                db.session.rollback()
                logger.error(f"Erro ao excluir feira: {e}")
                flash('Erro ao excluir feira.', 'error')
        
        return redirect(url_for('minhas_feiras'))

    @app.route('/perfil')
    def perfil():
        """Perfil do vendedor"""
        if 'user_id' not in session or session.get('user_type') != 'vendedor':
            return redirect(url_for('login'))

        vendedor = Vendedor.query.get(session['vendedor_id'])
        return render_template('perfil.html', vendedor=vendedor)

    @app.route('/editar-perfil', methods=['GET', 'POST'])
    def editar_perfil():
        """Editar perfil do vendedor"""
        if 'user_id' not in session or session.get('user_type') != 'vendedor':
            return redirect(url_for('login'))

        vendedor = Vendedor.query.get(session['vendedor_id'])
        
        if request.method == 'POST':
            try:
                vendedor.Nome = request.form.get('Nome')
                vendedor.Barraca = request.form.get('Barraca')
                vendedor.Email = request.form.get('Email')
                vendedor.CPFCNPJ = request.form.get('CPFCNPJ')
                vendedor.Telefone = request.form.get('Telefone')
                
                db.session.commit()
                flash('Perfil atualizado com sucesso!', 'success')
                return redirect(url_for('perfil'))
                
            except Exception as e:
                db.session.rollback()
                logger.error(f"Erro ao editar perfil: {e}")
                flash(f'Erro ao editar perfil: {str(e)}', 'error')

        return render_template('editar_perfil.html', vendedor=vendedor)

    # ========== ROTAS DE DESENVOLVIMENTO/TESTE ==========
    @app.route('/criar_vendedor_teste')
    def criar_vendedor_teste():
        """Cria vendedor de teste"""
        with app.app_context():
            if not Vendedor.query.filter_by(Email="test@email.com").first():
                vendedor = Vendedor(
                    Nome="Vendedor Teste",
                    Barraca="Barraca Teste",
                    Email="test@email.com", 
                    CPFCNPJ="12345678900",
                    Telefone="11999999999",
                    IdCli=None
                )
                vendedor.set_password("12345")
                db.session.add(vendedor)
                db.session.commit()
                print("✅ Vendedor criado: test@email.com / 12345")
            else:
                print("⚠️ Vendedor já existe")
        return "Vendedor teste criado ou já existente"

    @app.route('/debug-routes')
    def debug_routes():
        """Debug: lista todas as rotas"""
        routes = []
        for rule in app.url_map.iter_rules():
            if 'static' not in rule.endpoint:
                routes.append(f"{rule.endpoint}: {rule.rule} - {list(rule.methods)}")
        return '<br>'.join(routes)

    # ========== ROTA DE ERRO 404 ==========
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404