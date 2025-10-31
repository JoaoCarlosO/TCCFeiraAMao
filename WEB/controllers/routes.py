from flask import render_template, request, redirect, url_for, flash, session, jsonify
from models.database import db, Clientes, Vendedor, Produtos, Carrinho, Pedidos, Pagamento, Encomendas, Notificacao, MensagemSuporte
from werkzeug.security import generate_password_hash, check_password_hash
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
        # Lista de rotas públicas que não requerem login
        public_routes = ['home', 'login', 'cadastro', 'sobre', 'suporte', 'static']
        
        if request.endpoint and not any(route in request.endpoint for route in public_routes):
            if 'user_id' not in session:
                flash('Faça login para acessar esta página.', 'error')
                return redirect(url_for('login'))

    # ========== ROTAS PÚBLICAS ==========
    @app.route('/')
    def home():
        """Página inicial pública"""
        try:
            # Buscar alguns produtos para exibir na home
            produtos = Produtos.query.limit(6).all()
            vendedores = Vendedor.query.limit(4).all()
            return render_template('home.html', produtos=produtos, vendedores=vendedores)
        except Exception as e:
            logger.error(f"Erro na home: {e}")
            return render_template('home.html', produtos=[], vendedores=[])

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        """Página de login"""
        if request.method == 'POST':
            try:
                email = request.form.get('email')
                senha = request.form.get('senha')
                
                if not email or not senha:
                    flash('Por favor, preencha todos os campos.', 'error')
                    return render_template('login.html')

                # Primeiro tenta login como VENDEDOR
                vendedor = Vendedor.query.filter_by(Email=email).first()
                if vendedor and vendedor.check_password(senha):
                    session['user_id'] = vendedor.IdVend
                    session['user_type'] = 'vendedor'
                    session['user_name'] = vendedor.Nome
                    session['vendedor_id'] = vendedor.IdVend
                    
                    flash(f'Bem-vindo, {vendedor.Nome}!', 'success')
                    return redirect(url_for('homeVend'))
                
                # Tenta login como CLIENTE
                cliente = Clientes.query.filter_by(Email=email).first()
                if cliente and cliente.check_password(senha):
                    session['user_id'] = cliente.IdCli
                    session['user_type'] = 'cliente'
                    session['user_name'] = cliente.NomeCli
                    
                    flash(f'Bem-vindo, {cliente.NomeCli}!', 'success')
                    return redirect(url_for('homeCli'))
                
                flash('Email ou senha incorretos.', 'error')
                
            except Exception as e:
                logger.error(f"Erro no login: {e}")
                flash('Erro interno no sistema.', 'error')

        return render_template('login.html')

    @app.route('/logout')
    def logout():
        """Logout do usuário"""
        session.clear()
        flash('Logout realizado com sucesso!', 'success')
        return redirect(url_for('home'))

    @app.route('/cadastro', methods=['GET', 'POST'])
    def cadastro():
        """Cadastro de cliente"""
        if request.method == 'POST':
            try:
                nome = request.form.get('nome')
                telefone = request.form.get('telefone')
                email = request.form.get('email')
                endereco = request.form.get('endereco')
                nascimento = request.form.get('nascimento')
                cpf = request.form.get('cpf')
                senha = request.form.get('senha')
                
                # Validações básicas
                if not all([nome, email, nascimento, cpf, senha]):
                    flash('Por favor, preencha todos os campos obrigatórios.', 'error')
                    return render_template('cadastro.html')

                # Verificar se email já existe
                if Clientes.query.filter_by(Email=email).first():
                    flash('Email já cadastrado!', 'error')
                    return render_template('cadastro.html')
                
                if Clientes.query.filter_by(CPF=cpf).first():
                    flash('CPF já cadastrado!', 'error')
                    return render_template('cadastro.html')

                # Converter data
                try:
                    nascimento_date = datetime.strptime(nascimento, '%Y-%m-%d').date()
                except ValueError:
                    flash('Formato de data inválido. Use YYYY-MM-DD', 'error')
                    return render_template('cadastro.html')

                # Criar novo cliente
                novo_cliente = Clientes(
                    NomeCli=nome,
                    Telefone=telefone,
                    datanasc=nascimento_date,
                    LocalBusca=endereco,
                    Email=email,
                    CPF=cpf
                )
                novo_cliente.set_password(senha)

                db.session.add(novo_cliente)
                db.session.commit()
                
                flash('Cadastro realizado com sucesso! Faça login para continuar.', 'success')
                return redirect(url_for('login'))
                
            except Exception as e:
                db.session.rollback()
                logger.error(f"Erro no cadastro: {e}")
                flash(f'Erro no cadastro: {str(e)}', 'error')

        return render_template('cadastro.html')

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

    # ========== ROTAS DO CLIENTE ==========
    @app.route('/homeCli')
    def homeCli():
        """Home do cliente"""
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        try:
            produtos = Produtos.query.limit(12).all()
            vendedores = Vendedor.query.limit(8).all()
            return render_template("homeCli.html", produtos=produtos, vendedores=vendedores)
        except Exception as e:
            logger.error(f"Erro no homeCli: {e}")
            return render_template("homeCli.html", produtos=[], vendedores=[])

    @app.route('/perfilCli', methods=['GET', 'POST'])
    def perfilCli():
        """Perfil do cliente"""
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        cliente = Clientes.query.get(session['user_id'])
        
        if not cliente:
            flash('Cliente não encontrado.', 'error')
            return redirect(url_for('login'))

        if request.method == 'POST':
            try:
                cliente.NomeCli = request.form.get('nome', cliente.NomeCli)
                cliente.CPF = request.form.get('cpf', cliente.CPF)
                cliente.LocalBusca = request.form.get('endereco', cliente.LocalBusca)
                cliente.Email = request.form.get('email', cliente.Email)
                cliente.Telefone = request.form.get('telefone', cliente.Telefone)
                
                nascimento = request.form.get('nascimento')
                if nascimento:
                    try:
                        cliente.datanasc = datetime.strptime(nascimento, '%Y-%m-%d').date()
                    except:
                        flash('Formato de data inválido. Use YYYY-MM-DD', 'error')
                
                senha = request.form.get('senha')
                if senha:
                    cliente.set_password(senha)

                db.session.commit()
                session['user_name'] = cliente.NomeCli
                flash('Perfil atualizado com sucesso!', 'success')
                
            except Exception as e:
                db.session.rollback()
                logger.error(f"Erro ao atualizar perfil: {e}")
                flash(f'Erro ao atualizar perfil: {str(e)}', 'error')

        return render_template('perfilCli.html', cliente=cliente)

    @app.route('/cadastroVend', methods=['GET', 'POST'])
    def cadastroVend():
        """Cliente se torna vendedor"""
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        cliente = Clientes.query.get(session['user_id'])
        
        # Verificar se já é vendedor
        vendedor_existente = Vendedor.query.filter_by(Email=cliente.Email).first()
        if vendedor_existente:
            flash('Você já é um vendedor cadastrado!', 'info')
            session['user_type'] = 'vendedor'
            session['vendedor_id'] = vendedor_existente.IdVend
            return redirect(url_for('homeVend'))
        
        if request.method == 'POST':
            try:
                barraca = request.form.get('barraca')
                cpf_cnpj = request.form.get('cpf_cnpj')
                documento = request.form.get('documento')
                descricao = request.form.get('descricao')
                
                if not all([barraca, cpf_cnpj]):
                    flash('Por favor, preencha todos os campos obrigatórios.', 'error')
                    return render_template('cadastroVend.html')
                
                # Verificar se CPF/CNPJ já existe
                if Vendedor.query.filter_by(CPFCNPJ=cpf_cnpj).first():
                    flash('CPF/CNPJ já cadastrado!', 'error')
                    return render_template('cadastroVend.html')

                novo_vendedor = Vendedor(
                    Nome=cliente.NomeCli,
                    Barraca=barraca,
                    Email=cliente.Email,
                    CPFCNPJ=cpf_cnpj,
                    Telefone=cliente.Telefone,
                    Documento=documento,
                    Senha=cliente.Senha,  # Já está hasheada
                    vendedor_descricao=descricao
                )
                
                db.session.add(novo_vendedor)
                db.session.commit()
                
                # Atualizar sessão
                session['user_type'] = 'vendedor'
                session['vendedor_id'] = novo_vendedor.IdVend
                
                flash('Cadastro como vendedor realizado com sucesso!', 'success')
                return redirect(url_for('homeVend'))
                
            except Exception as e:
                db.session.rollback()
                logger.error(f"Erro no cadastro vendedor: {e}")
                flash(f'Erro no cadastro: {str(e)}', 'error')
        
        return render_template('cadastroVend.html', cliente=cliente)

    @app.route('/vendedor/<int:vendedor_id>')
    def ver_vendedor(vendedor_id):
        """Página do vendedor"""
        try:
            vendedor = Vendedor.query.get_or_404(vendedor_id)
            produtos = Produtos.query.filter_by(IdVend=vendedor_id).all()
            return render_template('vendedor.html', vendedor=vendedor, produtos=produtos)
        except Exception as e:
            logger.error(f"Erro ao carregar vendedor: {e}")
            flash('Erro ao carregar perfil do vendedor.', 'error')
            return redirect(url_for('homeCli'))

    @app.route('/produto/<int:produto_id>')
    def detalhes_produto(produto_id):
        """Detalhes do produto"""
        try:
            produto = Produtos.query.get_or_404(produto_id)
            vendedor = Vendedor.query.get(produto.IdVend)
            return render_template('produto.html', produto=produto, vendedor=vendedor)
        except Exception as e:
            logger.error(f"Erro ao carregar produto: {e}")
            flash('Erro ao carregar produto.', 'error')
            return redirect(url_for('homeCli'))

    @app.route('/adicionar_carrinho/<int:produto_id>', methods=['POST'])
    def adicionar_carrinho(produto_id):
        """Adicionar produto ao carrinho"""
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        try:
            quantidade = int(request.form.get('quantidade', 1))
            produto = Produtos.query.get_or_404(produto_id)
            
            if produto.Estoque and produto.Estoque < quantidade:
                flash('Quantidade indisponível em estoque.', 'error')
                return redirect(url_for('detalhes_produto', produto_id=produto_id))
            
            # Verificar se já está no carrinho
            item_carrinho = Carrinho.query.filter_by(
                IdCli=session['user_id'], 
                IdPro=produto_id
            ).first()
            
            if item_carrinho:
                item_carrinho.Quantidade += quantidade
            else:
                novo_item = Carrinho(
                    IdCli=session['user_id'],
                    IdPro=produto_id,
                    Quantidade=quantidade
                )
                db.session.add(novo_item)
            
            db.session.commit()
            flash('Produto adicionado ao carrinho!', 'success')
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Erro ao adicionar carrinho: {e}")
            flash(f'Erro ao adicionar ao carrinho: {str(e)}', 'error')
        
        return redirect(url_for('detalhes_produto', produto_id=produto_id))

    @app.route("/carrinhoCli")
    def carrinhoCli():
        """Carrinho do cliente"""
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        try:
            itens_carrinho = Carrinho.query.filter_by(IdCli=session['user_id']).all()
            carrinho_data = []
            total = 0
            
            for item in itens_carrinho:
                produto = Produtos.query.get(item.IdPro)
                if produto:
                    subtotal = float(produto.Preco) * item.Quantidade
                    total += subtotal
                    carrinho_data.append({
                        "id": item.IdCarrinho,
                        "produto_id": produto.IdPro,
                        "nome": produto.Nome,
                        "preco": float(produto.Preco),
                        "quantidade": item.Quantidade,
                        "img": produto.Imagem or '/static/imgs/produto-padrao.png',
                        "subtotal": subtotal,
                        "estoque": produto.Estoque
                    })
            
            return render_template("carrinhoCli.html", carrinho=carrinho_data, total=total)
            
        except Exception as e:
            logger.error(f"Erro no carrinho: {e}")
            return render_template("carrinhoCli.html", carrinho=[], total=0)

    @app.route('/atualizar_carrinho/<int:item_id>', methods=['POST'])
    def atualizar_carrinho(item_id):
        """Atualizar quantidade no carrinho"""
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        try:
            item = Carrinho.query.get_or_404(item_id)
            
            if item.IdCli != session['user_id']:
                flash('Acesso negado.', 'error')
                return redirect(url_for('carrinhoCli'))
            
            nova_quantidade = int(request.form.get('quantidade', 1))
            produto = Produtos.query.get(item.IdPro)
            
            if produto.Estoque and produto.Estoque < nova_quantidade:
                flash('Quantidade indisponível em estoque.', 'error')
                return redirect(url_for('carrinhoCli'))
            
            if nova_quantidade <= 0:
                db.session.delete(item)
            else:
                item.Quantidade = nova_quantidade
            
            db.session.commit()
            flash('Carrinho atualizado!', 'success')
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Erro ao atualizar carrinho: {e}")
            flash(f'Erro ao atualizar carrinho: {str(e)}', 'error')
        
        return redirect(url_for('carrinhoCli'))

    @app.route('/remover_carrinho/<int:item_id>', methods=['POST'])
    def remover_carrinho(item_id):
        """Remover item do carrinho"""
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        try:
            item = Carrinho.query.get_or_404(item_id)
            
            if item.IdCli != session['user_id']:
                flash('Acesso negado.', 'error')
                return redirect(url_for('carrinhoCli'))
            
            db.session.delete(item)
            db.session.commit()
            flash('Produto removido do carrinho!', 'success')
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Erro ao remover carrinho: {e}")
            flash(f'Erro ao remover produto: {str(e)}', 'error')
        
        return redirect(url_for('carrinhoCli'))

    @app.route("/notificacoesCli")
    def notificacoesCli():
        """Notificações do cliente"""
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        try:
            notificacoes = Notificacao.query.filter_by(IdCli=session['user_id']).order_by(Notificacao.DataEnvio.desc()).all()
            return render_template("notificacoesCli.html", notificacoes=notificacoes)
        except Exception as e:
            logger.error(f"Erro nas notificações: {e}")
            return render_template("notificacoesCli.html", notificacoes=[])

    @app.route("/encomendasCli")
    def encomendasCli():
        """Encomendas do cliente"""
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        try:
            encomendas_ativas = Encomendas.query.filter_by(IdCli=session['user_id']).filter(Encomendas.Status.in_(['pendente', 'processando'])).all()
            encomendas_finalizadas = Encomendas.query.filter_by(IdCli=session['user_id']).filter(Encomendas.Status.in_(['entregue', 'cancelado'])).all()
            
            return render_template("encomendasCli.html", 
                                 encomendas_ativas=encomendas_ativas, 
                                 encomendas_finalizadas=encomcomendas_finalizadas)
        except Exception as e:
            logger.error(f"Erro nas encomendas: {e}")
            return render_template("encomendasCli.html", 
                                 encomendas_ativas=[], 
                                 encomendas_finalizadas=[])

    @app.route('/sobreCli')
    def sobreCli():
        """Sobre para clientes"""
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        return render_template('sobreCli.html')

    # ========== ROTAS DO VENDEDOR ==========
    @app.route('/homeVend')
    def homeVend():
        """Home do vendedor"""
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))

        try:
            search_query = request.args.get('search', '').strip()
            vendedor = Vendedor.query.get(session['vendedor_id'])

            if search_query:
                produtos = Produtos.query.filter(
                    Produtos.Nome.ilike(f"%{search_query}%"),
                    Produtos.IdVend == session['vendedor_id']
                ).all()
            else:
                produtos = Produtos.query.filter_by(IdVend=session['vendedor_id']).all()

            total_produtos = len(produtos)
            produtos_estoque_baixo = [p for p in produtos if p.Estoque and p.Estoque < 10]

            return render_template('homeVend.html',
                                vendedor=vendedor,
                                produtos=produtos,
                                total_produtos=total_produtos,
                                estoque_baixo=len(produtos_estoque_baixo),
                                search_query=search_query)
        except Exception as e:
            logger.error(f"Erro no homeVend: {e}")
            return render_template('homeVend.html',
                                vendedor=None,
                                produtos=[],
                                total_produtos=0,
                                estoque_baixo=0,
                                search_query='')

    @app.route('/perfilVend', methods=['GET', 'POST'])
    def perfilVend():
        """Perfil do vendedor"""
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        vendedor = Vendedor.query.get(session['vendedor_id'])
        
        if not vendedor:
            flash('Vendedor não encontrado.', 'error')
            return redirect(url_for('login'))

        if request.method == 'POST':
            try:
                vendedor.Nome = request.form.get('nome', vendedor.Nome)
                vendedor.Barraca = request.form.get('barraca', vendedor.Barraca)
                vendedor.CPFCNPJ = request.form.get('cpf_cnpj', vendedor.CPFCNPJ)
                vendedor.Email = request.form.get('email', vendedor.Email)
                vendedor.Telefone = request.form.get('telefone', vendedor.Telefone)
                vendedor.Documento = request.form.get('documento', vendedor.Documento)
                vendedor.vendedor_descricao = request.form.get('descricao', vendedor.vendedor_descricao)
                
                senha = request.form.get('senha')
                if senha:
                    vendedor.set_password(senha)

                db.session.commit()
                session['user_name'] = vendedor.Nome
                flash('Perfil atualizado com sucesso!', 'success')
                
            except Exception as e:
                db.session.rollback()
                logger.error(f"Erro ao atualizar perfil vendedor: {e}")
                flash(f'Erro ao atualizar perfil: {str(e)}', 'error')

        return render_template('perfilVend.html', vendedor=vendedor)

    @app.route('/estoque')
    def estoque():
        """Estoque do vendedor"""
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        try:
            produtos = Produtos.query.filter_by(IdVend=session['vendedor_id']).all()
            return render_template('estoque.html', produtos=produtos)
        except Exception as e:
            logger.error(f"Erro no estoque: {e}")
            return render_template('estoque.html', produtos=[])

    @app.route('/adicionar_produto', methods=['GET', 'POST'])
    def adicionar_produto():
        """Adicionar produto"""
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        if request.method == 'POST':
            try:
                nome = request.form.get('nome')
                preco = request.form.get('preco')
                estoque = request.form.get('estoque')
                categoria = request.form.get('categoria')
                descricao = request.form.get('descricao')
                peso_quant = request.form.get('peso_quant')
                imagem = request.form.get('imagem')

                if not all([nome, preco]):
                    flash('Por favor, preencha nome e preço.', 'error')
                    return render_template('adicionar_produto.html')

                novo_produto = Produtos(
                    Nome=nome,
                    Preco=preco,
                    Estoque=estoque or 0,
                    Cat=categoria,
                    Descricao=descricao,
                    PesoQuant=peso_quant,
                    Imagem=imagem or '/static/imgs/produto-padrao.png',
                    IdVend=session['vendedor_id']
                )

                db.session.add(novo_produto)
                db.session.commit()
                flash('Produto adicionado com sucesso!', 'success')
                return redirect(url_for('estoque'))
                
            except Exception as e:
                db.session.rollback()
                logger.error(f"Erro ao adicionar produto: {e}")
                flash(f'Erro ao adicionar produto: {str(e)}', 'error')

        return render_template('adicionar_produto.html')

    @app.route('/editar_produto/<int:produto_id>', methods=['GET', 'POST'])
    def editar_produto(produto_id):
        """Editar produto"""
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        produto = Produtos.query.get_or_404(produto_id)
        
        if produto.IdVend != session['vendedor_id']:
            flash('Acesso negado.', 'error')
            return redirect(url_for('estoque'))

        if request.method == 'POST':
            try:
                produto.Nome = request.form.get('nome', produto.Nome)
                produto.Preco = request.form.get('preco', produto.Preco)
                produto.Estoque = request.form.get('estoque', produto.Estoque)
                produto.Cat = request.form.get('categoria', produto.Cat)
                produto.Descricao = request.form.get('descricao', produto.Descricao)
                produto.PesoQuant = request.form.get('peso_quant', produto.PesoQuant)
                produto.Imagem = request.form.get('imagem', produto.Imagem)

                db.session.commit()
                flash('Produto atualizado com sucesso!', 'success')
                return redirect(url_for('estoque'))
                
            except Exception as e:
                db.session.rollback()
                logger.error(f"Erro ao editar produto: {e}")
                flash(f'Erro ao atualizar produto: {str(e)}', 'error')

        return render_template('editar_produto.html', produto=produto)

    @app.route('/excluir_produto/<int:produto_id>', methods=['POST'])
    def excluir_produto(produto_id):
        """Excluir produto"""
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        produto = Produtos.query.get_or_404(produto_id)
        
        if produto.IdVend != session['vendedor_id']:
            flash('Acesso negado.', 'error')
            return redirect(url_for('estoque'))

        try:
            # Remover itens do carrinho associados a este produto
            Carrinho.query.filter_by(IdPro=produto_id).delete()
            db.session.delete(produto)
            db.session.commit()
            flash('Produto excluído com sucesso!', 'success')
        except Exception as e:
            db.session.rollback()
            logger.error(f"Erro ao excluir produto: {e}")
            flash(f'Erro ao excluir produto: {str(e)}', 'error')
        
        return redirect(url_for('estoque'))

    @app.route('/notificacoesVend')
    def notificacoesVend():
        """Notificações do vendedor"""
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        try:
            notificacoes = Notificacao.query.filter_by(IdVend=session['vendedor_id']).order_by(Notificacao.DataEnvio.desc()).all()
            return render_template('notificacoesVend.html', notificacoes=notificacoes)
        except Exception as e:
            logger.error(f"Erro nas notificações vendedor: {e}")
            return render_template('notificacoesVend.html', notificacoes=[])

    @app.route('/encomendasVend')
    def encomendasVend():
        """Encomendas do vendedor"""
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        try:
            encomendas = Encomendas.query.filter_by(IdVend=session['vendedor_id']).all()
            return render_template('encomendasVend.html', encomendas=encomendas)
        except Exception as e:
            logger.error(f"Erro nas encomendas vendedor: {e}")
            return render_template('encomendasVend.html', encomendas=[])

    @app.route('/sobreVend')
    def sobreVend():
        """Sobre para vendedores"""
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        return render_template('sobreVend.html')

    # ========== ROTAS DE PEDIDOS E PAGAMENTOS ==========
    @app.route('/finalizar_pedido', methods=['POST'])
    def finalizar_pedido():
        """Finalizar pedido"""
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        try:
            # Buscar itens do carrinho
            itens_carrinho = Carrinho.query.filter_by(IdCli=session['user_id']).all()
            
            if not itens_carrinho:
                flash('Carrinho vazio!', 'error')
                return redirect(url_for('carrinhoCli'))
            
            # Agrupar por vendedor
            pedidos_por_vendedor = {}
            for item in itens_carrinho:
                produto = Produtos.query.get(item.IdPro)
                if produto:
                    if produto.IdVend not in pedidos_por_vendedor:
                        pedidos_por_vendedor[produto.IdVend] = []
                    pedidos_por_vendedor[produto.IdVend].append((produto, item.Quantidade))
            
            # Criar pedidos para cada vendedor
            for vendedor_id, itens in pedidos_por_vendedor.items():
                subtotal = sum(float(produto.Preco) * quantidade for produto, quantidade in itens)
                
                # Criar pedido
                novo_pedido = Pedidos(
                    IdCli=session['user_id'],
                    IdVend=vendedor_id,
                    Subtotal=subtotal
                )
                
                db.session.add(novo_pedido)
                db.session.flush()  # Para obter o ID do pedido
                
                # Criar pagamento
                novo_pagamento = Pagamento(
                    IdPed=novo_pedido.IdPed,
                    Metodo=request.form.get('metodo_pagamento', 'cartao'),
                    Valor=subtotal
                )
                
                db.session.add(novo_pagamento)
                
                # Atualizar estoque
                for produto, quantidade in itens:
                    if produto.Estoque is not None:
                        produto.Estoque -= quantidade
            
            # Limpar carrinho
            Carrinho.query.filter_by(IdCli=session['user_id']).delete()
            
            db.session.commit()
            flash('Pedido realizado com sucesso!', 'success')
            return redirect(url_for('encomendasCli'))
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Erro ao finalizar pedido: {e}")
            flash(f'Erro ao finalizar pedido: {str(e)}', 'error')
            return redirect(url_for('carrinhoCli'))

    # ========== ROTA DE ERRO 404 ==========
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404

    # ========== API ROUTES ==========
    @app.route('/api/produtos')
    def api_produtos():
        """API para buscar produtos"""
        try:
            search = request.args.get('search', '')
            categoria = request.args.get('categoria', '')
            
            query = Produtos.query
            
            if search:
                query = query.filter(Produtos.Nome.ilike(f'%{search}%'))
            if categoria:
                query = query.filter(Produtos.Cat.ilike(f'%{categoria}%'))
                
            produtos = query.limit(20).all()
            
            produtos_data = []
            for produto in produtos:
                produtos_data.append({
                    'id': produto.IdPro,
                    'nome': produto.Nome,
                    'preco': float(produto.Preco),
                    'categoria': produto.Cat,
                    'estoque': produto.Estoque,
                    'imagem': produto.Imagem,
                    'vendedor': produto.vendedor.Nome if produto.vendedor else ''
                })
            
            return jsonify(produtos_data)
            
        except Exception as e:
            logger.error(f"Erro na API produtos: {e}")
            return jsonify([])