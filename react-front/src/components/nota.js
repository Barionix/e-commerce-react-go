// MyDocument.js
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderBottomStyle: "solid",
    paddingVertical: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "solid",
    paddingTop: 10,
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
    marginLeft: 8,
  },
});

const MyDocument = ({ chart, chartBind }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comprovante de Compra</Text>
        <Text>Código: {chartBind.code}</Text>
      </View>

      {/* Itens */}
      <View style={styles.section}>
        {chart.map((chartItem, index) => (
          <View style={styles.itemContainer} key={index}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Nome:</Text>
              <Text>{chartItem.nome}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Preço:</Text>
              <Text>{chartItem.preco} R$</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Categoria:</Text>
              <Text>{chartItem.categoria}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Quantidade:</Text>
              <Text>1</Text>
            </View>
          </View>
        ))}
        {chartBind.valorFinal && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Valor Final:</Text>
            <Text>{chartBind.valorFinal}</Text>
          </View>
        )}
      </View>

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Preço Total:</Text>
        <Text style={styles.totalValue}>{chartBind.valorFinal ? chartBind.valorFinal : chartBind.preco} R$</Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
