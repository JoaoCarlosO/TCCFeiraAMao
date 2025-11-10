from flask import render_template, request, redirect, url_for, flash, session
from models.database import db, Vendedor, Feiras, MensagemSuporte
from werkzeug.security import check_password_hash
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
        public_routes = ['home', 'login', 'sobre', 'suporte', 'static', 'logout', 'cadastrar_feiras']
        
        if request.endpoint and not any(route in request.endpoint for route in public_routes):
            if 'user_id' not in session or session.get('user_type') != 'vendedor':
                flash('Faça login como vendedor para acessar esta página.', 'error')
                return redirect(url_for('login'))

    # ========== ROTAS PÚBLICAS ==========
    @app.route('/')
    def home():
        return render_template('home.html')

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            email = request.form.get('Email', '').strip()
            senha = request.form.get('Senha', '').strip()
            
            print(f"🔍 TENTANDO LOGIN: {email} / {senha}")
            
            vendedor = Vendedor.query.filter_by(Email=email).first()
            if vendedor:
                print(f"✅ VENDEDOR ENCONTRADO: {vendedor.Nome}")
                print(f"🔐 SENHA NO BANCO: {vendedor.Senha}")
                
                # Teste DIRETO
                from werkzeug.security import check_password_hash
                resultado = check_password_hash(vendedor.Senha, senha)
                print(f"🎯 RESULTADO: {resultado}")
                
                if resultado:
                    # Login bem sucedido
                    session['user_id'] = vendedor.IdVend
                    session['user_type'] = 'vendedor'
                    session['user_name'] = vendedor.Nome
                    session['vendedor_id'] = vendedor.IdVend
                    flash(f'Bem-vindo, {vendedor.Nome}!', 'success')
                    return redirect(url_for('homeVend'))
                else:
                    flash('Senha incorreta.', 'error')
            else:
                flash('Vendedor não encontrado.', 'error')
        
        return render_template('login.html')

    @app.route('/logout')
    def logout():
            """Logout do usuário"""
            session.clear()
            flash('Logout realizado com sucesso!', 'success')
            return redirect(url_for('home'))

    @app.route('/sobre')
    def sobre():
        """Página sobre o sistema"""
        return render_template('sobre.html')

    @app.route('/suporte', methods=['GET', 'POST'])
    def suporte():
        """Página de suporte"""
        if request.method == 'POST':
            try:
                nome = request.form.get('nome')
                email = request.form.get('email')
                mensagem = request.form.get('mensagem')

                if not all([nome, email, mensagem]):
                    flash('Por favor, preencha todos os campos.', 'error')
                    return render_template('suporte.html')

                nova_msg = MensagemSuporte(
                    nome=nome, 
                    email=email, 
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

    # ========== CADASTRAR FEIRAS ==========
    @app.route('/cadastrar-feiras', methods=['GET', 'POST'])
    def cadastrar_feiras():
        """Cadastro de novas feiras - SOMENTE para vendedores logados"""
        # Verifica se está logado como vendedor
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

    # ========== HOME DO VENDEDOR ==========
    @app.route('/homeVend')
    def homeVend():
        """Home do vendedor - SOMENTE para vendedores logados"""
        if 'user_id' not in session or session.get('user_type') != 'vendedor':
            return redirect(url_for('login'))

        try:
            vendedor = Vendedor.query.get(session['vendedor_id'])
            
            # Buscar feiras do vendedor
            feiras = Feiras.query.filter_by(IdVend=session['vendedor_id']).all()

            return render_template('homeVend.html',
                                vendedor=vendedor,
                                feiras=feiras)
        except Exception as e:
            logger.error(f"Erro no homeVend: {e}")
            return render_template('homeVend.html',
                                vendedor=None,
                                feiras=[])

    # ========== ROTA DE ERRO 404 ==========
    @app.errorhandler(404)
    def page_not_found(e):
        return "Página não encontrada", 404
    

    @app.route('/criar_vendedor_teste')
    def criar_vendedor_teste():
        with app.app_context():
            if not Vendedor.query.filter_by(Email="test@email.com").first():
                vendedor = Vendedor(
                    Nome="Vendedor Teste",
                    Barraca="Barraca Teste",
                    Email="test@email.com", 
                    CPFCNPJ="12345678900",
                    Telefone="11999999999",
                    IdCli=None  # Pode ser NULL
                )
                vendedor.set_password("12345")
                db.session.add(vendedor)
                db.session.commit()
                print("✅ Vendedor criado: teste@email.com / 123456")
            else:
                print("⚠️ Vendedor já existe")
