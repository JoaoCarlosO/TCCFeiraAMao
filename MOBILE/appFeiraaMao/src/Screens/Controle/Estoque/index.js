
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const initialData = [
  { id: 1, produto: 'Maçã', Quantidade: '10', Valor: '2.00', Validade: '10/09/2025', total: 20.00 },
  { id: 2, produto: 'Banana', Quantidade: '5', Valor: '3.00', Validade: '08/09/2025', total: 15.00 },
];

const chartColors = [
  '#1c4b25ff', '#085317ff', '#088850ff', '#96CEB4', '#FECA57', '#87467eff', '#9b686dff', '#5F27CD',
  '#00D2D3', '#112948ff', '#10AC84', '#501a41ff', '#0984E3', '#A29BFE', '#FD79A8', '#0f2c46ff'
];

const Estoque = ({ navigation }) => {
  const [data, setData] = useState(initialData);
  const [nextId, setNextId] = useState(3);
  const [chartData, setChartData] = useState({ labels: [], values: [], colors: [] });

  const buildChart = (rows) => {
    const labels = rows.map(r => r.produto || '');
    const values = rows.map(r => Number(r.total || 0));
    const colors = rows.map((_, index) => chartColors[index % chartColors.length]);
    
    setChartData({ labels, values, colors });
  };

  useEffect(() => {
    buildChart(data);
  }, []);

  const calcularTotal = (quantidade, valor) => {
    const qtd = parseFloat(quantidade) || 0;
    const val = parseFloat(valor) || 0;
    return qtd * val;
  };

  const handleChange = (text, id, field) => {
    setData(old => {
      const updatedData = old.map(row => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: text };
          if (field === 'Quantidade' || field === 'Valor') {
            updatedRow.total = calcularTotal(
              field === 'Quantidade' ? text : row.Quantidade,
              field === 'Valor' ? text : row.Valor
            );
          }
          return updatedRow;
        }
        return row;
      });
      buildChart(updatedData);
      return updatedData;
    });
  };

  const addRow = () => {
    const newRow = {
      id: nextId,
      produto: '',
      Quantidade: '0',
      Valor: '0.00',
      Validade: '',
      total: 0,
    };
    setData(old => {
      const updatedData = [...old, newRow];
      buildChart(updatedData);
      return updatedData;
    });
    setNextId(n => n + 1);
  };

  const removeRow = (id) => {
    if (data.length <= 1) {
      Alert.alert('Aviso', 'É necessário manter pelo menos uma linha.');
      return;
    }
    setData(old => {
      const updatedData = old.filter(r => r.id !== id);
      buildChart(updatedData);
      return updatedData;
    });
  };

  const calcularTotalGeral = () => {
    return data.reduce((total, row) => total + (parseFloat(row.total) || 0), 0);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#425010" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal style={{ marginBottom: 16 }}>
        <View>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell, { width: 50 }]}>ID</Text>
            <Text style={[styles.cell, styles.headerCell, { minWidth: 160 }]}>Produto</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 90 }]}>Quantidade</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 110 }]}>Valor (R$)</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 110 }]}>Total (R$)</Text>
            <Text style={[styles.cell, styles.headerCell, { minWidth: 120 }]}>Validade</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 90 }]}>Ações</Text>
          </View>

          {data.map(row => (
            <View style={styles.row} key={row.id}>
              <Text style={[styles.cell, { width: 50 }]}>{row.id}</Text>
              <TextInput
                style={[styles.cell, { minWidth: 160 }]}
                value={row.produto}
                onChangeText={t => handleChange(t, row.id, 'produto')}
                placeholder="Nome do produto"
                placeholderTextColor="#999"
              />
              <TextInput
                style={[styles.cell, { width: 90 }]}
                value={String(row.Quantidade)}
                keyboardType="numeric"
                onChangeText={t => handleChange(t, row.id, 'Quantidade')}
                placeholderTextColor="#999"
              />
              <TextInput
                style={[styles.cell, { width: 110 }]}
                value={String(row.Valor)}
                keyboardType="numeric"
                onChangeText={t => handleChange(t, row.id, 'Valor')}
                placeholderTextColor="#999"
              />
              <Text style={[styles.cell, styles.totalCell, { width: 110 }]}>
                R$ {Number(row.total).toFixed(2)}
              </Text>
              <TextInput
                style={[styles.cell, { minWidth: 120 }]}
                value={row.Validade}
                placeholder="dd/mm/aaaa"
                placeholderTextColor="#999"
                onChangeText={t => handleChange(t, row.id, 'Validade')}
              />
              <View style={[styles.cell, { width: 90, flexDirection: 'row', justifyContent: 'center' }]}>
                <TouchableOpacity onPress={() => removeRow(row.id)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.totalGeralContainer}>
        <Text style={styles.totalGeralText}>
          Total Geral: R$ {calcularTotalGeral().toFixed(2)}
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={addRow} style={styles.addBtn}>
          <Ionicons name="add-circle-outline" size={22} color="#FFF" />
          <Text style={styles.addBtnText}>Adicionar Produto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.subtitle}>Gráfico de Valores por Produto</Text>
        {chartData.labels.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={{ 
                labels: chartData.labels, 
                datasets: [{ 
                  data: chartData.values,
                  colors: chartData.colors.map(c => () => c)
                }] 
              }}
              width={Math.max(SCREEN_WIDTH, chartData.labels.length * 100)}
              height={280}
              yAxisLabel="R$ "
              fromZero={true}
              chartConfig={{
                backgroundColor: '#d7cdcdff',
                backgroundGradientFrom: '#fdfdfaff',
                backgroundGradientTo: '#fefff9ff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
                style: { borderRadius: 16 },
                barPercentage: 0.7,
                propsForBackgroundLines: {
                  strokeWidth: 1,
                  stroke:  "#7b786dff",
                  strokeDasharray: '0',
                },
                propsForLabels: {
                  fontSize: 12,
                  fontWeight: '600',
                }
              }}
              style={styles.chart}
              showBarTops={true}
              withCustomBarColorFromData={true}
            />
          </ScrollView>
        ) : (
          <Text style={styles.noDataText}>Adicione produtos para ver o gráfico</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f7f5ff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2F4F4F',
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#50560dff',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

  headerRow: {
    backgroundColor: '#deb93dff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  cell: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#0b3a23ff',
    minHeight: 55,
    justifyContent: 'center',
    backgroundColor: '#fffff2'
  },

  totalCell: {
    backgroundColor: '#F8F9FA',
    fontWeight: '600',
    color: '#666d10ff',
  },

  headerCell: {
    fontWeight: '700',
    color: '#5f583cff',
    fontSize: 14,
    textAlign: 'center',
  },

  totalGeralContainer: {
    backgroundColor: '#CDA527',
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#093516ff',
    alignItems: 'center',
  },

  totalGeralText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#243207ff',
  },

  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  addBtn: {
    backgroundColor: '#425010',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },

  addBtnText: {
    color: '#BCAF77',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },

  deleteBtn: {
    backgroundColor: '#0c5527ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  chartContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    elevation: 3,
  },

  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 20,
  },

  noDataText: {
    textAlign: 'center',
    color: '#677b8dff',
    fontSize: 16,
    fontStyle: 'italic',
    padding: 20,
  },
});

export default Estoque;
