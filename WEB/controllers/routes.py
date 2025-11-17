# controllers/routes.py
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models.database import db, Vendedor, Feiras, MensagemSuporte
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
import logging

# Configuração de logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def init_app(app):
    # Rotas públicas que não exigem login
    public_routes = [
        'home', 'login', 'sobre', 'suporte', 'static', 
        'logout', 'cadastrar_vendedor', 'criar_vendedor_teste', 
        'debug_routes', 'api_register'
    ]

    @app.before_request
    def before_request():
        """Verifica se o usuário está logado antes de acessar rotas protegidas"""
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
        """Página sobre o projeto"""
        return render_template('sobre.html')

    @app.route('/suporte', methods=['GET', 'POST'])
    def suporte():
        """Página de suporte"""
        if request.method == 'POST':
            try:
                Nome = request.form.get('Nome', '').strip()
                Email = request.form.get('Email', '').strip()
                mensagem = request.form.get('mensagem', '').strip()

                # Validação dos campos
                if not all([Nome, Email, mensagem]):
                    flash('Por favor, preencha todos os campos.', 'error')
                    return render_template('suporte.html')

                if len(mensagem) < 10:
                    flash('A mensagem deve ter pelo menos 10 caracteres.', 'error')
                    return render_template('suporte.html')

                # Salva a mensagem no banco
                nova_msg = MensagemSuporte(
                    Nome=Nome,
                    Email=Email,
                    Mensagem=mensagem
                )
                db.session.add(nova_msg)
                db.session.commit()
                
                flash('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success')
                return redirect(url_for('suporte'))
                
            except Exception as e:
                db.session.rollback()
                logger.error(f"Erro no suporte: {e}")
                flash('Erro ao enviar mensagem. Tente novamente.', 'error')

        return render_template('suporte.html')

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        """Página de login"""
        # Se já estiver logado, redireciona para homeVend
        if 'user_id' in session and session.get('user_type') == 'vendedor':
            return redirect(url_for('homeVend'))

        if request.method == 'POST':
            try:
                Email = request.form.get('Email', '').strip().lower()
                Senha = request.form.get('Senha', '').strip()

                # Validação básica
                if not Email or not Senha:
                    flash('Por favor, preencha todos os campos.', 'error')
                    return render_template('login.html')

                # Busca o vendedor
                vendedor = Vendedor.query.filter_by(Email=Email).first()

                if not vendedor:
                    flash('Email não cadastrado.', 'error')
                    return render_template('login.html')

                # Verifica a senha
                if vendedor.check_password(Senha):
                    session['user_id'] = vendedor.IdVend
                    session['user_name'] = vendedor.Nome
                    session['user_type'] = 'vendedor'
                    
                    flash(f'Bem-vindo(a), {vendedor.Nome}!', 'success')
                    return redirect(url_for('homeVend'))
                else:
                    flash('Senha incorreta.', 'error')
                    
            except Exception as e:
                logger.error(f"Erro no login: {e}")
                flash('Erro ao fazer login. Tente novamente.', 'error')

        return render_template('login.html')

    @app.route('/cadastrar-vendedor', methods=['GET', 'POST'])
    def cadastrar_vendedor():
        """Cadastro de novo vendedor"""
        if request.method == 'POST':
            try:
                # Coleta dados do formulário
                Nome = request.form.get('Nome', '').strip()
                Barraca = request.form.get('Barraca', '').strip()
                Email = request.form.get('Email', '').strip().lower()
                CPFCNPJ = request.form.get('CPFCNPJ', '').strip()
                Telefone = request.form.get('Telefone', '').strip()
                Senha = request.form.get('Senha', '').strip()
                ConfirmarSenha = request.form.get('ConfirmarSenha', '').strip()
                IdCli = request.form.get('IdCli', '').strip()

                # Validações
                if not all([Nome, Email, CPFCNPJ, Senha]):
                    flash('Por favor, preencha todos os campos obrigatórios.', 'error')
                    return render_template('cadastrar_vendedor.html')

                if Senha != ConfirmarSenha:
                    flash('As senhas não coincidem.', 'error')
                    return render_template('cadastrar_vendedor.html')

                if len(Senha) < 6:
                    flash('A senha deve ter pelo menos 6 caracteres.', 'error')
                    return render_template('cadastrar_vendedor.html')

                # Verifica se email já existe
                if Vendedor.query.filter_by(Email=Email).first():
                    flash('Este email já está cadastrado.', 'error')
                    return render_template('cadastrar_vendedor.html')

                # Verifica se CPF/CNPJ já existe
                if Vendedor.query.filter_by(CPFCNPJ=CPFCNPJ).first():
                    flash('Este CPF/CNPJ já está cadastrado.', 'error')
                    return render_template('cadastrar_vendedor.html')

                # Cria novo vendedor
                novo_vendedor = Vendedor(
                    Nome=Nome,
                    Barraca=Barraca,
                    Email=Email,
                    CPFCNPJ=CPFCNPJ,
                    Telefone=Telefone,
                    IdCli=int(IdCli) if IdCli and IdCli.isdigit() else None
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

    @app.route('/logout')
    def logout():
        """Logout do usuário"""
        session.clear()
        flash('Logout realizado com sucesso!', 'success')
        return redirect(url_for('home'))

    # ========== ROTAS PROTEGIDAS (VENDEDOR) ==========

    @app.route('/homeVend')
    def homeVend():
        """Dashboard do vendedor"""
        try:
            vendedor = Vendedor.query.get(session['user_id'])
            feiras = Feiras.query.filter_by(IdVend=session['user_id']).all()
            
            return render_template('homeVend.html', 
                                 vendedor=vendedor, 
                                 feiras=feiras,
                                 feiras_count=len(feiras))
        except Exception as e:
            logger.error(f"Erro no homeVend: {e}")
            flash('Erro ao carregar página.', 'error')
            return redirect(url_for('login'))

    @app.route('/cadastrar-feiras', methods=['GET', 'POST'])
    def cadastrar_feiras():
        """Cadastro de novas feiras"""
        if request.method == 'POST':
            try:
                nome_feira = request.form.get('nome_feira', '').strip()
                localizacao = request.form.get('localizacao', '').strip()
                dias = request.form.get('dias_funcionamento', '').strip()
                horario = request.form.get('horario_funcionamento', '').strip()

                # Validações
                if not all([nome_feira, localizacao]):
                    flash('Nome da feira e localização são obrigatórios.', 'error')
                    return render_template('cadastrar_feiras.html')

                # Cria nova feira
                nova_feira = Feiras(
                    NomeFeira=nome_feira,
                    Localizacao=localizacao,
                    DiasFuncionamento=dias,
                    HorarioFuncionamento=horario,
                    IdVend=session['user_id']
                )
                
                db.session.add(nova_feira)
                db.session.commit()
                
                flash('Feira cadastrada com sucesso!', 'success')
                return redirect(url_for('homeVend'))
                
            except Exception as e:
                db.session.rollback()
                logger.error(f"Erro ao cadastrar feira: {e}")
                flash('Erro ao cadastrar feira. Tente novamente.', 'error')

        return render_template('cadastrar_feiras.html')

    @app.route('/minhas-feiras')
    def minhas_feiras():
        """Lista de feiras do vendedor"""
        try:
            feiras = Feiras.query.filter_by(IdVend=session['user_id']).order_by(Feiras.NomeFeira).all()
            return render_template('minhas_feiras.html', feiras=feiras)
        except Exception as e:
            logger.error(f"Erro ao carregar feiras: {e}")
            flash('Erro ao carregar feiras.', 'error')
            return redirect(url_for('homeVend'))

    @app.route('/editar-feira/<int:id>', methods=['GET', 'POST'])
    def editar_feira(id):
        """Edição de feira existente"""
        try:
            feira = Feiras.query.filter_by(IdFeira=id, IdVend=session['user_id']).first()
            
            if not feira:
                flash('Feira não encontrada ou você não tem permissão para editá-la.', 'error')
                return redirect(url_for('minhas_feiras'))

            if request.method == 'POST':
                feira.NomeFeira = request.form.get('nome_feira', '').strip()
                feira.Localizacao = request.form.get('localizacao', '').strip()
                feira.DiasFuncionamento = request.form.get('dias_funcionamento', '').strip()
                feira.HorarioFuncionamento = request.form.get('horario_funcionamento', '').strip()
                
                db.session.commit()
                flash('Feira atualizada com sucesso!', 'success')
                return redirect(url_for('minhas_feiras'))

            return render_template('editar_feira.html', feira=feira)
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Erro ao editar feira: {e}")
            flash('Erro ao editar feira.', 'error')
            return redirect(url_for('minhas_feiras'))

    @app.route('/excluir-feira/<int:id>')
    def excluir_feira(id):
        """Exclusão de feira"""
        try:
            feira = Feiras.query.filter_by(IdFeira=id, IdVend=session['user_id']).first()
            
            if feira:
                db.session.delete(feira)
                db.session.commit()
                flash('Feira excluída com sucesso!', 'success')
            else:
                flash('Feira não encontrada.', 'error')
                
        except Exception as e:
            db.session.rollback()
            logger.error(f"Erro ao excluir feira: {e}")
            flash('Erro ao excluir feira.', 'error')
            
        return redirect(url_for('minhas_feiras'))

    @app.route('/perfil')
    def perfil():
        """Página de perfil do vendedor"""
        try:
            vendedor = Vendedor.query.get(session['user_id'])
            return render_template('perfil.html', vendedor=vendedor)
        except Exception as e:
            logger.error(f"Erro ao carregar perfil: {e}")
            flash('Erro ao carregar perfil.', 'error')
            return redirect(url_for('homeVend'))

    @app.route('/editar-perfil', methods=['GET', 'POST'])
    def editar_perfil():
        """Edição do perfil do vendedor"""
        try:
            vendedor = Vendedor.query.get(session['user_id'])
            
            if request.method == 'POST':
                vendedor.Nome = request.form.get('Nome', '').strip()
                vendedor.Barraca = request.form.get('Barraca', '').strip()
                vendedor.Email = request.form.get('Email', '').strip().lower()
                vendedor.CPFCNPJ = request.form.get('CPFCNPJ', '').strip()
                vendedor.Telefone = request.form.get('Telefone', '').strip()
                
                # Verifica se o novo email já existe (para outro usuário)
                email_existente = Vendedor.query.filter(
                    Vendedor.Email == vendedor.Email,
                    Vendedor.IdVend != session['user_id']
                ).first()
                
                if email_existente:
                    flash('Este email já está sendo usado por outro vendedor.', 'error')
                    return render_template('editar_perfil.html', vendedor=vendedor)
                
                db.session.commit()
                session['user_name'] = vendedor.Nome
                flash('Perfil atualizado com sucesso!', 'success')
                return redirect(url_for('perfil'))
                
            return render_template('editar_perfil.html', vendedor=vendedor)
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Erro ao editar perfil: {e}")
            flash('Erro ao atualizar perfil.', 'error')
            return redirect(url_for('perfil'))

    # ========== ROTAS DE DESENVOLVIMENTO/TESTE ==========

    @app.route('/criar_vendedor_teste')
    def criar_vendedor_teste():
        """Rota para criar vendedor de teste (apenas desenvolvimento)"""
        try:
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
                    return "✅ Vendedor teste criado: test@email.com / 12345"
                else:
                    return "ℹ️ Vendedor já existe."
        except Exception as e:
            return f"❌ Erro: {e}"

    @app.route('/debug-routes')
    def debug_routes():
        """Lista todas as rotas disponíveis"""
        routes = []
        for rule in app.url_map.iter_rules():
            if 'static' not in rule.endpoint:
                routes.append(f"{rule.endpoint}: {rule.rule} - {list(rule.methods)}")
        return '<br>'.join(routes)

    @app.route('/api/register', methods=['POST'])
    def api_register():
        """API para registro de vendedores"""
        try:
            data = request.get_json()
            
            novo_vendedor = Vendedor(
                Nome=data.get('Nome'),
                Barraca=data.get('Barraca'),
                Email=data.get('Email'),
                CPFCNPJ=data.get('CPFCNPJ'),
                Telefone=data.get('Telefone'),
                IdCli=data.get('IdCli')
            )
            novo_vendedor.set_password(data.get('Senha'))
            
            db.session.add(novo_vendedor)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Vendedor cadastrado com sucesso',
                'id': novo_vendedor.IdVend
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': f'Erro no cadastro: {str(e)}'
            }), 400

    # ========== HANDLERS DE ERRO ==========

    @app.errorhandler(404)
    def page_not_found(e):
        """Página não encontrada"""
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        """Erro interno do servidor"""
        logger.error(f"Erro 500: {e}")
        return render_template('500.html'), 500

    @app.errorhandler(403)
    def forbidden(e):
        """Acesso proibido"""
        return render_template('403.html'), 403