from flask import render_template, request, redirect, url_for, flash, session
from models.database import db, Clientes, Vendedor, Produtos, Carrinho, Pedidos, Pagamento, Encomendas, Notificacao, MensagemSuporte
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

def init_app(app):
    @app.route('/')
    def home():
        return render_template('home.html')

# CORRETO - sem indentação antes do @app.route
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            email = request.form['username'] 
            senha = request.form['password']
            
            # Primeiro tenta login como CLIENTE (todo usuário é cliente)
            cliente = Clientes.query.filter_by(Email=email).first()
            if cliente and check_password_hash(cliente.Senha, senha):
                session['user_id'] = cliente.IdCli
                session['user_type'] = 'cliente'
                session['user_name'] = cliente.NomeCli
                
                # Verifica se este cliente também é vendedor
                vendedor = Vendedor.query.filter_by(Email=email).first()
                if vendedor:
                    session['user_type'] = 'vendedor'
                    session['vendedor_id'] = vendedor.IdVend
                    flash('Login como vendedor realizado!', 'success')
                    return redirect(url_for('homeVend'))
                else:
                    flash('Login realizado com sucesso!', 'success')
                    return redirect(url_for('homeCli'))
                
            # Se não encontrou como cliente, retorna erro
            flash('Email ou senha incorretos.', 'error')
            return redirect(url_for('login'))

        return render_template('login.html')

    @app.route('/logout')
    def logout():
        session.clear()
        flash('Logout realizado com sucesso!', 'success')
        return redirect(url_for('home'))

    @app.route('/cadastro', methods=['GET', 'POST'])
    def cadastro():
        if request.method == 'POST':
            nome = request.form.get('nome')
            telefone = request.form.get('telefone')
            email = request.form.get('email')
            endereco = request.form.get('endereco')
            nascimento = request.form.get('nascimento')
            cpf = request.form.get('cpf')
            senha = request.form.get('senha')
            
            # Verificar se email já existe
            if Clientes.query.filter_by(Email=email).first():
                flash('Email já cadastrado!', 'error')
                return render_template('cadastro.html')
            
            if Clientes.query.filter_by(CPF=cpf).first():
                flash('CPF já cadastrado!', 'error')
                return render_template('cadastro.html')

            try:
                from datetime import datetime
                nascimento_date = datetime.strptime(nascimento, '%d/%m/%Y').date()
            except ValueError:
                flash('Formato de data inválido. Use DD/MM/YYYY', 'error')
                return render_template('cadastro.html')

            novo_cliente = Clientes(
                NomeCli=nome,
                Telefone=telefone,
                datanasc=nascimento_date,
                LocalBusca=endereco,
                Email=email,
                CPF=cpf,
                Senha=generate_password_hash(senha)
            )

            try:
                db.session.add(novo_cliente)
                db.session.commit()
                flash('Cadastro realizado com sucesso! Faça login.', 'success')
                return redirect(url_for('login'))
            except Exception as e:
                db.session.rollback()
                flash(f'Erro no cadastro: {str(e)}', 'error')

        return render_template('cadastro.html')

    @app.route('/cadastroVend', methods=['GET', 'POST'])
    def cadastroVend():
        # Verifica se o usuário está logado como cliente
        if 'user_id' not in session or session['user_type'] != 'cliente':
            flash('Faça login como cliente primeiro para se tornar vendedor.', 'error')
            return redirect(url_for('login'))
        
        if request.method == 'POST':
            # Pega os dados do formulário de vendedor
            barraca = request.form.get('barraca')
            cpf_cnpj = request.form.get('cpf_cnpj')
            documento = request.form.get('documento')
            descricao = request.form.get('descricao')
            
            # Busca o cliente logado
            cliente = Clientes.query.get(session['user_id'])
            
            # Verifica se já é vendedor
            vendedor_existente = Vendedor.query.filter_by(Email=cliente.Email).first()
            if vendedor_existente:
                flash('Você já é um vendedor cadastrado!', 'info')
                return redirect(url_for('homeVend'))
            
            # Cria novo vendedor
            novo_vendedor = Vendedor(
                Nome=cliente.NomeCli,
                Barraca=barraca,
                Email=cliente.Email,
                CPFCNPJ=cpf_cnpj,
                Telefone=cliente.Telefone,
                Documento=documento,
                Senha=cliente.Senha,  # Usa a mesma senha do cliente
                vendedor_descricao=descricao
            )
            
            try:
                db.session.add(novo_vendedor)
                db.session.commit()
                
                # Atualiza a sessão para vendedor
                session['user_type'] = 'vendedor'
                session['vendedor_id'] = novo_vendedor.IdVend
                
                flash('Cadastro como vendedor realizado com sucesso!', 'success')
                return redirect(url_for('homeVend'))
            except Exception as e:
                db.session.rollback()
                flash(f'Erro no cadastro: {str(e)}', 'error')
        
        return render_template('cadastroVend.html')

    @app.route('/perfilCli', methods=['GET', 'POST'])
    def perfilCli():
        if 'user_id' not in session or session['user_type'] != 'cliente':
            flash('Faça login para acessar esta página.', 'error')
            return redirect(url_for('homeVend'))
        
        cliente = Clientes.query.get(session['user_id'])
        
        if not cliente:
            flash('Cliente não encontrado.', 'error')
            return redirect(url_for('homeVend'))

        if request.method == 'POST':
            cliente.NomeCli = request.form.get('nome', cliente.NomeCli)
            cliente.CPF = request.form.get('cpf', cliente.CPF)
            cliente.LocalBusca = request.form.get('endereco', cliente.LocalBusca)
            cliente.Email = request.form.get('email', cliente.Email)
            cliente.Telefone = request.form.get('telefone', cliente.Telefone)
            
            # Atualizar data de nascimento se fornecida
            nascimento = request.form.get('nascimento')
            if nascimento:
                try:
                    cliente.datanasc = datetime.strptime(nascimento, '%Y-%m-%d').date()
                except:
                    flash('Formato de data inválido.', 'error')
            
            senha = request.form.get('senha')
            if senha:
                cliente.Senha = generate_password_hash(senha)

            try:
                db.session.commit()
                session['user_name'] = cliente.NomeCli
                flash('Perfil atualizado com sucesso!', 'success')
            except Exception as e:
                db.session.rollback()
                flash(f'Erro ao atualizar perfil: {str(e)}', 'error')

        return render_template('perfilCli.html', cliente=cliente)

    @app.route('/perfilVend', methods=['GET', 'POST'])
    def perfilVend():
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            flash('Faça login como vendedor para acessar esta página.', 'error')
            return redirect(url_for('login'))
        
        vendedor = Vendedor.query.get(session['user_id'])
        
        if not vendedor:
            flash('Vendedor não encontrado.', 'error')
            return redirect(url_for('login'))

        if request.method == 'POST':
            vendedor.Nome = request.form.get('nome', vendedor.Nome)
            vendedor.Barraca = request.form.get('barraca', vendedor.Barraca)
            vendedor.CPFCNPJ = request.form.get('cpf_cnpj', vendedor.CPFCNPJ)
            vendedor.Email = request.form.get('email', vendedor.Email)
            vendedor.Telefone = request.form.get('telefone', vendedor.Telefone)
            vendedor.Documento = request.form.get('documento', vendedor.Documento)
            vendedor.vendedor_descricao = request.form.get('descricao', vendedor.vendedor_descricao)
            
            senha = request.form.get('senha')
            if senha:
                vendedor.Senha = generate_password_hash(senha)

            try:
                db.session.commit()
                session['user_name'] = vendedor.Nome
                flash('Perfil atualizado com sucesso!', 'success')
            except Exception as e:
                db.session.rollback()
                flash(f'Erro ao atualizar perfil: {str(e)}', 'error')

        return render_template('perfilVend.html', vendedor=vendedor)

    @app.route('/homeCli')
    def homeCli():
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
         # Dados de exemplo para testar o carrossel
        ofertas = [
            {'img': 'imgs/boloderoda.png', 'nome': 'Produto Oferta 1', 'preco': '29,90'},
            {'img': 'imgs/produto2.jpg', 'nome': 'Produto Oferta 2', 'preco': '39,90'},
            {'img': 'imgs/produto3.jpg', 'nome': 'Produto Oferta 3', 'preco': '19,90'}
        ]
        
        # Buscar produtos em destaque
        produtos = Produtos.query.limit(8).all()
        
        # Buscar vendedores
        vendedores = Vendedor.query.limit(6).all()
        
        return render_template("homeCli.html", produtos=produtos, vendedores=vendedores)

    @app.route('/homeVend', methods=['GET', 'POST'])
    def homeVend():
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))

        search_query = request.form.get('search', '').strip()

        vendedor = Vendedor.query.get(session['user_id'])

        if search_query:
            produtos = Produtos.query.filter(
                Produtos.Nome.ilike(f"%{search_query}%"),
                Produtos.IdVend == session['user_id']
            ).all()
        else:
            produtos = Produtos.query.filter_by(IdVend=session['user_id']).all()

        total_produtos = len(produtos)
        produtos_estoque_baixo = [p for p in produtos if p.Estoque and p.Estoque < 10]

        return render_template('homeVend.html',
                            vendedor=vendedor,
                            produtos=produtos,
                            total_produtos=total_produtos,
                            estoque_baixo=len(produtos_estoque_baixo),
                            search_query=search_query)

    @app.route('/vendedor/<int:vendedor_id>')
    def detalhes_vendedor(vendedor_id):
        try:
            vendedor = Vendedor.query.get_or_404(vendedor_id)
            produtos = Produtos.query.filter_by(IdVend=vendedor_id).all()
            return render_template('vendedor.html', vendedor=vendedor, produtos=produtos)
        except Exception as e:
            flash(f'Erro ao carregar perfil do vendedor: {str(e)}', 'error')
            return redirect(url_for('homeCli'))

    @app.route('/produto/<int:produto_id>')
    def detalhes_produto(produto_id):
        try:
            produto = Produtos.query.get_or_404(produto_id)
            vendedor = Vendedor.query.get(produto.IdVend)
            return render_template('produto.html', produto=produto, vendedor=vendedor)
        except Exception as e:
            flash(f'Erro ao carregar produto: {str(e)}', 'error')
            return redirect(url_for('homeCli'))

    @app.route('/adicionar_carrinho/<int:produto_id>', methods=['POST'])
    def adicionar_carrinho(produto_id):
        if 'user_id' not in session or session['user_type'] != 'cliente':
            flash('Faça login para adicionar produtos ao carrinho.', 'error')
            return redirect(url_for('login'))
        
        quantidade = int(request.form.get('quantidade', 1))
        produto = Produtos.query.get_or_404(produto_id)
        
        # Verificar estoque
        if produto.Estoque and produto.Estoque < quantidade:
            flash('Quantidade indisponível em estoque.', 'error')
            return redirect(url_for('detalhes_produto', produto_id=produto_id))
        
        # Verificar se produto já está no carrinho
        item_carrinho = Carrinho.query.filter_by(IdCli=session['user_id'], IdPro=produto_id).first()
        
        if item_carrinho:
            item_carrinho.Quantidade += quantidade
        else:
            novo_item = Carrinho(
                IdCli=session['user_id'],
                IdPro=produto_id,
                Quantidade=quantidade
            )
            db.session.add(novo_item)
        
        try:
            db.session.commit()
            flash('Produto adicionado ao carrinho!', 'success')
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao adicionar ao carrinho: {str(e)}', 'error')
        
        return redirect(url_for('detalhes_produto', produto_id=produto_id))

    @app.route('/carrinhoCli')
    def carrinhoCli():
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        itens_carrinho = Carrinho.query.filter_by(IdCli=session['user_id']).all()
        total = 0
        for item in itens_carrinho:
            if item.produto:
                total += float(item.produto.Preco) * item.Quantidade
        
        return render_template('carrinhoCli.html', itens=itens_carrinho, total=total)

    @app.route('/remover_carrinho/<int:item_id>', methods=['POST'])
    def remover_carrinho(item_id):
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        item = Carrinho.query.get_or_404(item_id)
        
        # Verificar se o item pertence ao usuário
        if item.IdCli != session['user_id']:
            flash('Acesso negado.', 'error')
            return redirect(url_for('carrinhoCli'))
        
        try:
            db.session.delete(item)
            db.session.commit()
            flash('Produto removido do carrinho!', 'success')
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao remover produto: {str(e)}', 'error')
        
        return redirect(url_for('carrinhoCli'))

    @app.route('/estoque')
    def estoque():
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        produtos = Produtos.query.filter_by(IdVend=session['user_id']).all()
        return render_template('estoque.html', produtos=produtos)

    # ==============================
    # ROTAS DE SUPORTE (APENAS UMA VEZ)
    # ==============================
    @app.route('/suporte', methods=['GET', 'POST'])
    def suporte():
        if request.method == 'POST':
            nome = request.form.get('nome')
            email = request.form.get('email')
            mensagem = request.form.get('mensagem')

            if not nome or not email or not mensagem:
                flash('Por favor, preencha todos os campos.', 'danger')
            else:
                nova_msg = MensagemSuporte(
                    nome=nome, 
                    email=email, 
                    mensagem=mensagem
                )
                try:
                    db.session.add(nova_msg)
                    db.session.commit()
                    flash('Mensagem enviada com sucesso! Obrigado pelo contato.', 'success')
                    return redirect(url_for('suporte'))
                except Exception as e:
                    db.session.rollback()
                    flash(f'Erro ao enviar mensagem: {str(e)}', 'error')

        return render_template('suporte.html')

    # ==============================
    # ROTAS BÁSICAS (SEM DUPLICAÇÕES)
    # ==============================
    @app.route('/sobre')
    def sobre():
        return render_template('sobre.html')

    @app.route('/sobreCli')
    def sobreCli():
        return render_template('sobreCli.html')

    @app.route('/sobreVend')
    def sobreVend():
        return render_template('sobreVend.html')

    @app.route('/notificacoesCli')
    def notificacoesCli():
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        notificacoes = Notificacao.query.filter_by(IdCli=session['user_id']).order_by(Notificacao.DataEnvio.desc()).all()
        return render_template('notificacoesCli.html', notificacoes=notificacoes)

    @app.route('/notificacoesVend')
    def notificacoesVend():
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        notificacoes = Notificacao.query.filter_by(IdVend=session['user_id']).order_by(Notificacao.DataEnvio.desc()).all()
        return render_template('notificacoesVend.html', notificacoes=notificacoes)

    @app.route('/encomendasCli')
    def encomendasCli():
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        encomendas = Encomendas.query.filter_by(IdCli=session['user_id']).all()
        return render_template('encomendasCli.html', encomendas=encomendas)

    @app.route('/encomendasVend')
    def encomendasVend():
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        encomendas = Encomendas.query.filter_by(IdVend=session['user_id']).all()
        return render_template('encomendasVend.html', encomendas=encomendas)
    
    @app.route('/vendedor/<int:vendedor_id>')
    def vendedor(vendedor_id):
        # Dados pré-estabelecidos dos vendedores
        vendedores = {
            1: {
                'id': 1,
                'nome': 'Dona Marta',
                'foto': 'imgs/vendedor1.png',
                'descricao': 'Vendedora de produtos caseiros há mais de 10 anos',
                'avaliacao': 4.8,
                'sobre': 'Especializada em bolos e doces caseiros. Todos os produtos feitos com ingredientes frescos e amor.',
                'produtos': [
                    {'nome': 'Bolo de Roda', 'img': 'imgs/boloderoda.png', 'preco': 12.00},
                    {'nome': 'Pão Caseiro', 'img': 'imgs/paoCaseiro.png', 'preco': 10.00},
                    {'nome': 'Bala de Banana', 'img': 'imgs/imgCarrossel1.png', 'preco': 12.00},
                    {'nome': 'Bolo de Fubá', 'img': 'imgs/boloOferta.png', 'preco': 20.00}
                ]
            },
            2: {
                'id': 2,
                'nome': 'João Gomes', 
                'foto': 'imgs/vendedor2.png',
                'descricao': 'Artesão especializado em palha e madeira',
                'avaliacao': 4.5,
                'sobre': 'Criando artesanato sustentável há 5 anos. Todos os produtos feitos manualmente.',
                'produtos': [
                    {'nome': 'Bolsa de Palha', 'img': 'imgs/bolsaPalha.png', 'preco': 20.00},
                    {'nome': 'Coruja de Madeira', 'img': 'imgs/coruja.png', 'preco': 12.99},
                    {'nome': 'Descanso de Panela', 'img': 'imgs/descansoPanela.png', 'preco': 9.99},
                    {'nome': 'Bandeja de Sushi', 'img': 'imgs/sushi.png', 'preco': 14.99}
                ]
            }
        }
        
        # Buscar o vendedor pelo ID
        vendedor = vendedores.get(vendedor_id)
        
        return render_template('vendedor.html', vendedor=vendedor)