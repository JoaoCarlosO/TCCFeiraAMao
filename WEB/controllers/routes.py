from flask import render_template, request, redirect, url_for, flash, session
from models.database import db, Clientes, Vendedor, Produtos, Carrinho, Pedidos, Pagamento, Encomendas, Notificacao, MensagemSuporte
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

def init_app(app):
    # ========== ROTAS PÚBLICAS ==========
    @app.route('/')
    def home():
        return render_template('home.html')

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            email = request.form['username'] 
            senha = request.form['password']
            
            # Primeiro tenta login como CLIENTE
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
                flash('Cadastro realizado com sucesso!', 'success')
                return redirect(url_for('homeCli'))
            except Exception as e:
                db.session.rollback()
                flash(f'Erro no cadastro: {str(e)}', 'error')

        return render_template('cadastro.html')

    @app.route('/sobre')
    def sobre():
        return render_template('sobre.html')

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

    # ========== ROTAS DO CLIENTE ==========
    @app.route('/homeCli')
    def homeCli():
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        # Buscar produtos e vendedores do banco
        produtos = Produtos.query.limit(8).all()
        vendedores = Vendedor.query.limit(6).all()
        
        return render_template("homeCli.html", produtos=produtos, vendedores=vendedores)

    @app.route('/perfilCli', methods=['GET', 'POST'])
    def perfilCli():
        if 'user_id' not in session or session['user_type'] != 'cliente':
            flash('Faça login para acessar esta página.', 'error')
            return redirect(url_for('login'))
        
        cliente = Clientes.query.get(session['user_id'])
        
        if not cliente:
            flash('Cliente não encontrado.', 'error')
            return redirect(url_for('login'))

        if request.method == 'POST':
            cliente.NomeCli = request.form.get('nome', cliente.NomeCli)
            cliente.CPF = request.form.get('cpf', cliente.CPF)
            cliente.LocalBusca = request.form.get('endereco', cliente.LocalBusca)
            cliente.Email = request.form.get('email', cliente.Email)
            cliente.Telefone = request.form.get('telefone', cliente.Telefone)
            
            nascimento = request.form.get('nascimento')
            if nascimento:
                try:
                    cliente.datanasc = datetime.strptime(nascimento, '%d-%m-%Y').date()
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

    @app.route('/cadastroVend', methods=['GET', 'POST'])
    def cadastroVend():
        if 'user_id' not in session or session['user_type'] != 'cliente':
            flash('Faça login como cliente primeiro para se tornar vendedor.', 'error')
            return redirect(url_for('login'))
        
        if request.method == 'POST':
            barraca = request.form.get('barraca')
            cpf_cnpj = request.form.get('cpf_cnpj')
            documento = request.form.get('documento')
            descricao = request.form.get('descricao')
            
            cliente = Clientes.query.get(session['user_id'])
            
            vendedor_existente = Vendedor.query.filter_by(Email=cliente.Email).first()
            if vendedor_existente:
                flash('Você já é um vendedor cadastrado!', 'info')
                return redirect(url_for('homeVend'))
            
            novo_vendedor = Vendedor(
                Nome=cliente.NomeCli,
                Barraca=barraca,
                Email=cliente.Email,
                CPFCNPJ=cpf_cnpj,
                Telefone=cliente.Telefone,
                Documento=documento,
                Senha=cliente.Senha,
                vendedor_descricao=descricao
            )
            
            try:
                db.session.add(novo_vendedor)
                db.session.commit()
                
                session['user_type'] = 'vendedor'
                session['vendedor_id'] = novo_vendedor.IdVend
                
                flash('Cadastro como vendedor realizado com sucesso!', 'success')
                return redirect(url_for('homeVend'))
            except Exception as e:
                db.session.rollback()
                flash(f'Erro no cadastro: {str(e)}', 'error')
        
        return render_template('cadastroVend.html')

    @app.route('/vendedor/<int:vendedor_id>')
    def vendedor(vendedor_id):  # MUDAR O NOME DA FUNÇÃO
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
        
        if produto.Estoque and produto.Estoque < quantidade:
            flash('Quantidade indisponível em estoque.', 'error')
            return redirect(url_for('detalhes_produto', produto_id=produto_id))
        
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

    @app.route("/carrinhoCli")
    def carrinhoCli():
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
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
                    "img": produto.Imagem or 'imgs/produto1.png',
                    "subtotal": subtotal
                })
        
        return render_template("carrinhoCli.html", carrinhoCli=carrinho_data, total=total)

    @app.route('/atualizar_carrinho/<int:item_id>', methods=['POST'])
    def atualizar_carrinho(item_id):
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        item = Carrinho.query.get_or_404(item_id)
        
        if item.IdCli != session['user_id']:
            flash('Acesso negado.', 'error')
            return redirect(url_for('carrinhoCli'))
        
        nova_quantidade = int(request.form.get('quantidade', 1))
        produto = Produtos.query.get(item.IdPro)
        
        if produto.Estoque and produto.Estoque < nova_quantidade:
            flash('Quantidade indisponível em estoque.', 'error')
            return redirect(url_for('carrinhoCli'))
        
        item.Quantidade = nova_quantidade
        
        try:
            db.session.commit()
            flash('Carrinho atualizado!', 'success')
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao atualizar carrinho: {str(e)}', 'error')
        
        return redirect(url_for('carrinhoCli'))

    @app.route('/remover_carrinho/<int:item_id>', methods=['POST'])
    def remover_carrinho(item_id):
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        item = Carrinho.query.get_or_404(item_id)
        
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

    @app.route("/notificacoesCli")
    def notificacoesCli():
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        notificacoes = Notificacao.query.filter_by(IdCli=session['user_id']).order_by(Notificacao.DataEnvio.desc()).all()
        return render_template("notificacoesCli.html", notificacoesCli=notificacoes)

    @app.route("/encomendasCli")
    def encomendasCli():
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        encomendas_ativas = Encomendas.query.filter_by(IdCli=session['user_id']).filter(Encomendas.Status.in_(['pendente', 'processando'])).all()
        encomendas_finalizadas = Encomendas.query.filter_by(IdCli=session['user_id']).filter(Encomendas.Status.in_(['entregue', 'cancelado'])).all()
        
        return render_template("encomendasCli.html", 
                             encomendas_ativas=encomendas_ativas, 
                             encomendas_finalizadas=encomendas_finalizadas)

    @app.route('/sobreCli')
    def sobreCli():
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        return render_template('sobreCli.html')

    # ========== ROTAS DO VENDEDOR ==========
    @app.route('/homeVend', methods=['GET', 'POST'])
    def homeVend():
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))

        search_query = request.form.get('search', '').strip()
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

    @app.route('/perfilVend', methods=['GET', 'POST'])
    def perfilVend():
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            flash('Faça login como vendedor para acessar esta página.', 'error')
            return redirect(url_for('login'))
        
        vendedor = Vendedor.query.get(session['vendedor_id'])
        
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

    @app.route('/estoque')
    def estoque():
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        produtos = Produtos.query.filter_by(IdVend=session['vendedor_id']).all()
        return render_template('estoque.html', produtos=produtos)

    @app.route('/adicionar_produto', methods=['GET', 'POST'])
    def adicionar_produto():
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        if request.method == 'POST':
            nome = request.form.get('nome')
            preco = request.form.get('preco')
            estoque = request.form.get('estoque')
            categoria = request.form.get('categoria')
            descricao = request.form.get('descricao')
            peso_quant = request.form.get('peso_quant')
            imagem = request.form.get('imagem')

            novo_produto = Produtos(
                Nome=nome,
                Preco=preco,
                Estoque=estoque,
                Cat=categoria,
                Descricao=descricao,
                PesoQuant=peso_quant,
                Imagem=imagem,
                IdVend=session['vendedor_id']
            )

            try:
                db.session.add(novo_produto)
                db.session.commit()
                flash('Produto adicionado com sucesso!', 'success')
                return redirect(url_for('estoque'))
            except Exception as e:
                db.session.rollback()
                flash(f'Erro ao adicionar produto: {str(e)}', 'error')

        return render_template('adicionar_produto.html')

    @app.route('/editar_produto/<int:produto_id>', methods=['GET', 'POST'])
    def editar_produto(produto_id):
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        produto = Produtos.query.get_or_404(produto_id)
        
        # Verificar se o produto pertence ao vendedor
        if produto.IdVend != session['vendedor_id']:
            flash('Acesso negado.', 'error')
            return redirect(url_for('estoque'))

        if request.method == 'POST':
            produto.Nome = request.form.get('nome', produto.Nome)
            produto.Preco = request.form.get('preco', produto.Preco)
            produto.Estoque = request.form.get('estoque', produto.Estoque)
            produto.Cat = request.form.get('categoria', produto.Cat)
            produto.Descricao = request.form.get('descricao', produto.Descricao)
            produto.PesoQuant = request.form.get('peso_quant', produto.PesoQuant)
            produto.Imagem = request.form.get('imagem', produto.Imagem)

            try:
                db.session.commit()
                flash('Produto atualizado com sucesso!', 'success')
                return redirect(url_for('estoque'))
            except Exception as e:
                db.session.rollback()
                flash(f'Erro ao atualizar produto: {str(e)}', 'error')

        return render_template('editar_produto.html', produto=produto)

    @app.route('/excluir_produto/<int:produto_id>', methods=['POST'])
    def excluir_produto(produto_id):
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        produto = Produtos.query.get_or_404(produto_id)
        
        # Verificar se o produto pertence ao vendedor
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
            flash(f'Erro ao excluir produto: {str(e)}', 'error')
        
        return redirect(url_for('estoque'))

    @app.route('/notificacoesVend')
    def notificacoesVend():
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        notificacoes = Notificacao.query.filter_by(IdVend=session['vendedor_id']).order_by(Notificacao.DataEnvio.desc()).all()
        return render_template('notificacoesVend.html', notificacoes=notificacoes)

    @app.route('/encomendasVend')
    def encomendasVend():
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        
        encomendas = Encomendas.query.filter_by(IdVend=session['vendedor_id']).all()
        return render_template('encomendasVend.html', encomendas=encomendas)

    @app.route('/sobreVend')
    def sobreVend():
        if 'user_id' not in session or session['user_type'] != 'vendedor':
            return redirect(url_for('login'))
        return render_template('sobreVend.html')

    # ========== ROTAS DE PEDIDOS E PAGAMENTOS ==========
    @app.route('/finalizar_pedido', methods=['POST'])
    def finalizar_pedido():
        if 'user_id' not in session or session['user_type'] != 'cliente':
            return redirect(url_for('login'))
        
        # Buscar itens do carrinho
        itens_carrinho = Carrinho.query.filter_by(IdCli=session['user_id']).all()
        
        if not itens_carrinho:
            flash('Carrinho vazio!', 'error')
            return redirect(url_for('carrinhoCli'))
        
        try:
            # Calcular subtotal
            subtotal = 0
            for item in itens_carrinho:
                produto = Produtos.query.get(item.IdPro)
                if produto:
                    subtotal += float(produto.Preco) * item.Quantidade
            
            # Criar pedido
            novo_pedido = Pedidos(
                IdCli=session['user_id'],
                DataPed=datetime.now().date(),
                StatusCli='pendente',
                Subtotal=subtotal
            )
            
            db.session.add(novo_pedido)
            db.session.flush()  # Para obter o ID do pedido
            
            # Criar pagamento
            novo_pagamento = Pagamento(
                IdPed=novo_pedido.IdPed,
                Metodo=request.form.get('metodo_pagamento', 'cartao'),
                Valor=subtotal,
                StatusPag='pendente',
                DataPag=datetime.now().date()
            )
            
            db.session.add(novo_pagamento)
            
            # Limpar carrinho
            Carrinho.query.filter_by(IdCli=session['user_id']).delete()
            
            db.session.commit()
            flash('Pedido realizado com sucesso!', 'success')
            return redirect(url_for('encomendasCli'))
            
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao finalizar pedido: {str(e)}', 'error')
            return redirect(url_for('carrinhoCli'))

    # ========== ROTA DE ERRO 404 ==========
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404