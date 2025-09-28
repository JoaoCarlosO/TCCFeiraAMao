import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    ImageBackground,
    Platform,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import { Ionicons } from '@expo/vector-icons';

export default function AdicionarEditarProdutoScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const productToEdit = route.params?.productData;

    // Estado com todos os campos necessários
    const [formData, setFormData] = useState({
        nome: productToEdit?.Nome || "",
        categoria: productToEdit?.Cat || "",
        preco: productToEdit?.Preco ? productToEdit.Preco.toString().replace('.', ',') : "",
        quantidade: productToEdit?.Quant ? productToEdit.Quant.toString() : "",
        estoque: productToEdit?.Estoque ? productToEdit.Estoque.toString() : "",
        descricao: productToEdit?.Descricao || "",
        peso: productToEdit?.Peso || "",
        unidadeMedida: productToEdit?.UnidadeMedida || "un",
        idVend: productToEdit?.IdVend ? productToEdit.IdVend.toString() : "1",
    });

    const [imagemProduto, setImagemProduto] = useState(
        productToEdit?.ImagemURL ? { uri: productToEdit.ImagemURL } : null
    );

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const isEditing = !!productToEdit;

    useEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Editar Produto' : 'Adicionar Produto'
        });
    }, [isEditing, navigation]);

    const precoFormatado = formData.preco
        ? `R$ ${parseFloat(formData.preco.replace(",", ".")).toFixed(2).replace(".", ",")}`
        : "";

    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSalvar = async () => {
        setMessage("");

        // Validação de campos obrigatórios
        if (!formData.nome || !formData.categoria || !formData.preco || 
            !formData.quantidade || !formData.estoque || !imagemProduto) {
            setMessage("Por favor, preencha todos os campos obrigatórios!");
            return;
        }

        setIsLoading(true);

        try {
            const localIp = '10.239.20.142';
            const apiUrl = Platform.OS === 'web'
                ? `http://localhost/BDTCC/${isEditing ? 'editar.php' : 'salvar.php'}`
                : `http://${localIp}/BDTCC/${isEditing ? 'editar.php' : 'salvar.php'}`;

            const formDataToSend = new FormData();

            if (isEditing) {
                formDataToSend.append("IdPro", productToEdit.IdPro);
            }

            // Adiciona todos os campos ao FormData
            formDataToSend.append("nome", formData.nome);
            formDataToSend.append("preco", formData.preco.replace(",", "."));
            formDataToSend.append("quantidade", formData.quantidade);
            formDataToSend.append("estoque", formData.estoque);
            formDataToSend.append("categoria", formData.categoria);
            formDataToSend.append("descricao", formData.descricao);
            formDataToSend.append("peso", formData.peso);
            formDataToSend.append("unidade_medida", formData.unidadeMedida);
            formDataToSend.append("id_vendedor", formData.idVend);

            if (imagemProduto && imagemProduto.uri.startsWith('file://')) {
                formDataToSend.append("imagem", {
                    uri: imagemProduto.uri,
                    name: `produto_${Date.now()}.jpg`,
                    type: "image/jpeg",
                });
            } else if (isEditing && imagemProduto) {
                formDataToSend.append("imagem_url_existente", imagemProduto.uri);
            }

            const response = await fetch(apiUrl, {
                method: "POST",
                body: formDataToSend,
            });

            const textResponse = await response.text();
            let jsonResponse;

            try {
                jsonResponse = JSON.parse(textResponse);
            } catch (parseError) {
                console.error("Erro ao fazer parse da resposta:", parseError);
                setMessage("Erro: Resposta inválida do servidor");
                setIsLoading(false);
                return;
            }

            if (jsonResponse.sucesso) {
                Alert.alert("Sucesso!", jsonResponse.mensagem || "Produto salvo com sucesso");
                if (!isEditing) {
                    // Limpa o formulário apenas se for uma adição nova
                    setFormData({
                        nome: "",
                        categoria: "",
                        preco: "",
                        quantidade: "",
                        estoque: "",
                        descricao: "",
                        peso: "",
                        unidadeMedida: "un",
                        idVend: "1"
                    });
                    setImagemProduto(null);
                }
                navigation.navigate("telaprodutosvend");
            } else {
                setMessage("Erro: " + (jsonResponse.mensagem || "Erro desconhecido"));
            }
        } catch (error) {
            console.error("Erro:", error);
            setMessage("Erro de conexão com o servidor");
        } finally {
            setIsLoading(false);
        }
    };

    const escolherImagemProduto = () => {
        const options = {
            mediaType: "photo",
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("Seleção cancelada");
            } else if (response.errorCode) {
                setMessage("Erro: " + response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                setImagemProduto({ uri: response.assets[0].uri });
            }
        });
    };

    return (
        <ImageBackground
            source={require("../../../assets/img/fundo-perfil.png")}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.areaForm}>
                        {/* Seção de Imagem */}
                        <Text style={styles.sectionTitle}>Imagem do Produto*</Text>
                        <TouchableOpacity
                            style={styles.imagemBox}
                            onPress={escolherImagemProduto}
                            disabled={isLoading}
                        >
                            {imagemProduto ? (
                                <Image source={imagemProduto} style={styles.imagemPreview} />
                            ) : (
                                <View style={styles.placeholder}>
                                    <Ionicons name="camera-outline" size={30} color="#666" />
                                    <Text style={{ color: "#666" }}>Selecionar imagem</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Seção de Informações Básicas */}
                        <Text style={styles.sectionTitle}>Informações Básicas</Text>
                        
                        <Text style={styles.label}>Nome do Produto*</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.nome}
                            onChangeText={(text) => handleChange("nome", text)}
                            placeholder="Ex: Maçãs Orgânicas"
                            placeholderTextColor="#999"
                            editable={!isLoading}
                        />

                        <Text style={styles.label}>Categoria*</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.categoria}
                            onChangeText={(text) => handleChange("categoria", text)}
                            placeholder="Ex: Frutas, Doces, Salgados"
                            placeholderTextColor="#999"
                            editable={!isLoading}
                        />

                        <Text style={styles.label}>Preço*</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.preco}
                            onChangeText={(text) => handleChange("preco", text.replace(",", "."))}
                            placeholder="Ex: 5.99"
                            keyboardType="numeric"
                            placeholderTextColor="#999"
                            editable={!isLoading}
                        />
                        {precoFormatado ? (
                            <Text style={styles.hintText}>Valor formatado: {precoFormatado}</Text>
                        ) : null}

                        {/* Seção de Estoque */}
                        <Text style={styles.sectionTitle}>Estoque</Text>
                        
                        <Text style={styles.label}>Quantidade Disponível*</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.quantidade}
                            onChangeText={(text) => handleChange("quantidade", text)}
                            placeholder="Ex: 10"
                            keyboardType="numeric"
                            placeholderTextColor="#999"
                            editable={!isLoading}
                        />

                        <Text style={styles.label}>Estoque Total*</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.estoque}
                            onChangeText={(text) => handleChange("estoque", text)}
                            placeholder="Ex: 20"
                            keyboardType="numeric"
                            placeholderTextColor="#999"
                            editable={!isLoading}
                        />

                        {/* Seção de Detalhes */}
                        <Text style={styles.sectionTitle}>Detalhes do Produto</Text>
                        
                        <Text style={styles.label}>Descrição</Text>
                        <TextInput
                            style={[styles.input, { height: 80 }]}
                            value={formData.descricao}
                            onChangeText={(text) => handleChange("descricao", text)}
                            placeholder="Descreva seu produto (opcional)"
                            placeholderTextColor="#999"
                            multiline
                            editable={!isLoading}
                        />

                        <View style={styles.rowInputs}>
                            <View style={[styles.inputContainer, { flex: 2 }]}>
                                <Text style={styles.label}>Peso/Quantidade</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.peso}
                                    onChangeText={(text) => handleChange("peso", text)}
                                    placeholder="Ex: 1, 0.5, 250"
                                    keyboardType="numeric"
                                    placeholderTextColor="#999"
                                    editable={!isLoading}
                                />
                            </View>
                            
                            <View style={[styles.inputContainer, { flex: 1 }]}>
                                <Text style={styles.label}>Unidade</Text>
                                <View style={styles.picker}>
                                    <Text style={styles.pickerText}>{formData.unidadeMedida}</Text>
                                </View>
                            </View>
                        </View>

                        {message ? (
                            <Text style={styles.messageText}>{message}</Text>
                        ) : null}

                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={handleSalvar}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        {isEditing ? "ATUALIZAR PRODUTO" : "CADASTRAR PRODUTO"}
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => navigation.goBack()}
                                disabled={isLoading}
                            >
                                <Text style={[styles.buttonText, styles.cancelText]}>CANCELAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    areaForm: {
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#404A12',
        marginTop: 20,
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        marginTop: 10,
        color: '#555',
        fontWeight: '500',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginTop: 5,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    imagemBox: {
        height: 180,
        borderRadius: 10,
        backgroundColor: '#f3f3f3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    imagemPreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 10,
    },
    inputContainer: {
        flex: 1,
    },
    picker: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginTop: 5,
        marginBottom: 15,
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    pickerText: {
        fontSize: 16,
        color: '#333',
    },
    hintText: {
        fontSize: 13,
        color: '#666',
        marginTop: -10,
        marginBottom: 15,
    },
    buttonsContainer: {
        flexDirection: 'column',
        marginTop: 30,
        marginBottom: 20,
        gap: 15,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButton: {
        backgroundColor: '#404A12',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#404A12',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff',
    },
    cancelText: {
        color: '#404A12',
    },
    messageText: {
        fontSize: 14,
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
});