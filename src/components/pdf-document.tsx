import React, { Fragment } from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { fontSize: 11, paddingTop: 20, paddingLeft: 40, paddingRight: 40, lineHeight: 1.5, flexDirection: 'column' },
    spaceBetween: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: "#3E3E3E" },
    titleContainer: { flexDirection: 'row', marginTop: 24 },
    logo: { width: 90 },
    reportTitle: { fontSize: 16, textAlign: 'center' },
    addressTitle: { fontSize: 11, fontWeight: 'bold' }, 
    invoice: { fontWeight: 'bold', fontSize: 20 },
    invoiceNumber: { fontSize: 11, fontWeight: 'bold' }, 
    address: { fontWeight: 400, fontSize: 10 },
    theader: { marginTop: 20, fontSize: 10, fontWeight: 'bold', paddingTop: 4, paddingLeft: 7, flex: 1, height: 20, backgroundColor: '#DEDEDE', borderColor: 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1 },
    tbody: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1, borderColor: 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1 },
    total: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1.5, borderColor: 'whitesmoke', borderBottomWidth: 1 },
});

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};


const TableTotal = ({ items }) => {
    const total = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    return (
        <View style={{ width: '100%', flexDirection: 'row' }}>
            <View style={styles.total}><Text></Text></View>
            <View style={styles.total}><Text></Text></View>
            <View style={styles.tbody}><Text>Total</Text></View>
            <View style={styles.tbody}><Text>{formatCurrency(total)}</Text></View>
        </View>
    );
};


const InvoiceTitle = ({ logo }) => (
    <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
            <Image style={styles.logo} src={logo} />
            <Text style={styles.reportTitle}>Xpress Enterprises</Text>
        </View>
    </View>
);


const Address = ({ budget }) => (
    <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
            <View>
                <Text style={styles.invoice}>Orçamento</Text>
                <Text style={styles.invoiceNumber}>Protocolo: {budget.id}</Text>
            </View>
            <View>
                <Text style={styles.addressTitle}>Clinte: {budget.clientName}</Text>
                <Text style={styles.addressTitle}>CNPJ: {budget.clientCnpj}</Text>
                <Text style={styles.addressTitle}>Contato: {budget.clientPhone}</Text>
            </View>
        </View>
    </View>
);


const TableBody = ({ items }) => (
    <>
        {items.map((item, index) => (
            <Fragment key={index}>
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={styles.tbody}><Text>{item.description}</Text></View>
                    <View style={styles.tbody}><Text>{formatCurrency(item.unitPrice)}</Text></View>
                    <View style={styles.tbody}><Text>{item.quantity}</Text></View>
                    <View style={styles.tbody}><Text>{formatCurrency(item.total)}</Text></View>
                </View>
            </Fragment>
        ))}
    </>
);


const PdfDocument = ({ budget }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <InvoiceTitle logo="/image/logo_preta.png" />
            <Address budget={budget} />
            <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
                <View style={styles.tbody}><Text>Item</Text></View>
                <View style={styles.tbody}><Text>Preço Unitário</Text></View>
                <View style={styles.tbody}><Text>Quantidade</Text></View>
                <View style={styles.tbody}><Text>Total</Text></View>
            </View>
            <TableBody items={budget.items} />
            <TableTotal items={budget.items} />
        </Page>
    </Document>
);

export default PdfDocument;
