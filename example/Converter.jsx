import React, { Component } from 'react'
import { 
    Row, 
    Col, 
    NavbarBrand 
} from 'reactstrap'
import FilesList from './FilesList'
import ChosenFile from './ChosenFile'
import PaymentData from './PaymentData'
import '../../assets/scss/converter.scss'
import _ from 'lodash'


import firstPDF from '../../assets/pdf-examples/1.png'
import secondPDF from '../../assets/pdf-examples/2.png'
import thirdPDF from '../../assets/pdf-examples/3.png'
import fourthPDF from '../../assets/pdf-examples/4.png'


export default class Converter extends Component {

    files = [
        {file: firstPDF, id: '1', defaultBank: 'swedbank', recipent: 'my fitness as', iban: null, amount: '63.00', invoiceNR: '18311951', reference: '5666132'},
        {file: secondPDF, id: '2', defaultBank: 'bebebank', recipent: 'bebe', iban: 'e5464567346346546', amount: '', invoiceNR: '18311951', reference: '5666132'},
        {file: thirdPDF, id: '3', defaultBank: 'estbank', recipent: '', iban: null, amount: '69.00', invoiceNR: '18311951', reference: '5666132'},
        {file: fourthPDF, id: '4', defaultBank: 'ukbank', recipent: 'claz', iban: 'e654645745867867', amount: '55.00', invoiceNR: '18311951', reference: '5666132'}
    ]

    state = {
        chosenFile: _.clone(this.files[0]),
        isEditing: false,
        textReady: false,
        editingField: null,
        text: '',
        editedDocument: {
            tl: undefined,
            br: undefined,
            fieldName: undefined,
            id: undefined,
        }
    }

    paymentRef = React.createRef();

    chooseFile = (chosenFile) => {
        let file = _.clone(chosenFile)
        this.setState({chosenFile: file}, () => {
            this.endEdit()
        })
    }

    startEdit = (editingField) => {
        this.setState({
            isEditing: !this.state.isEditing,
            editingField
        })
    }

    endEdit = () => {
        this.setState({
            isEditing: false,
            textReady: false,
            editingField: null,
            text: ''
        })
    }

    confirmText = (status, crop, id) => {
        let { editedDocument } = this.state;
        if (crop && id) {
            let { width, height, x, y } = crop;
            let bottomRightX = width + x;
            let bottomRightY = height + y;
            editedDocument.br = [bottomRightX, bottomRightY];
            editedDocument.tl = [x, y];
            editedDocument.fieldName = this.state.editingField;
            editedDocument.id = id;
            if (this.paymentRef.current && window.matchMedia("(max-width: 991px)").matches) {
                this.paymentRef.current.scrollIntoView();
            }
        }
        this.setState({
            textReady: status,
            isEditing: status
        })
    }

    getText = (text) => {
        this.setState({
            text
        })
    }

    render() {
        console.log('converter state: ', this.state)
        const { editingField, isEditing, textReady, text } = this.state
        return (
            <div className="converter-page">
                <div className="top-navbar">
                    <div className="navbar-brand-assets ">
                        <NavbarBrand>{this.props.pageHeader}</NavbarBrand>
                    </div>
                </div>
                <div className="content">
                    <Row>
                        <Col className="files-list-col">
                            <FilesList 
                                chosenFile={this.state.chosenFile} 
                                chooseFile={this.chooseFile} 
                                files={this.files}
                                />
                        </Col>
                        <Col className="chosen-file-col">
                            <ChosenFile 
                                textReady={textReady} 
                                isEditing={this.state.isEditing} 
                                chosenFile={this.state.chosenFile}
                                confirmText={this.confirmText}
                                getText={this.getText} 
                                endEdit={this.endEdit}
                                />
                        </Col>
                        <Col className="payment-data-col">
                            <PaymentData 
                                paymentRef={this.paymentRef}
                                chosenFile={this.state.chosenFile} 
                                text={text}
                                confirmText={this.confirmText} 
                                editingField={editingField} 
                                isEditing={isEditing} 
                                startEdit={this.startEdit} 
                                endEdit={this.endEdit}
                                />
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
