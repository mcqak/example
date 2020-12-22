import React, { Component } from 'react'
import { 
    Card,
    CardHeader,
    CardBody
} from 'reactstrap'

import file from '../../assets/img/font-icons/pdf-icon-e.svg'
// import autosize from 'autosize'
import TextareaAutosize from 'react-textarea-autosize';

export default class PaymentData extends Component {

    state = {
        paymentData: undefined
    }

    static getDerivedStateFromProps = (props) => {
        return {
            chosenFile: props.chosenFile
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.text && this.props.editingField && this.props.text !== prevProps.text) {
            const { chosenFile } = this.state;
            chosenFile[this.props.editingField] = this.props.text
            this.setState({chosenFile})
        }
        // autosize(document.querySelector('textarea'))
    }

    fields = ['default bank', 'recepient', 'iban', 'amount', 'invoice nr', 'reference']

    handleChange = (e) => {
        const { chosenFile } = this.state;
        chosenFile[e.target.id] = e.target.value
        this.setState({chosenFile})
    }

    render() {
        // console.log('payment props: ', this.props)
        const { chosenFile } = this.state;
        const { defaultBank, recipent, iban, amount, invoiceNR, reference} = chosenFile;

        const isFill = Object.values(chosenFile).filter(value => value).length === Object.keys(chosenFile).length

        return (
            <Card className="payment-data-card">
                <CardHeader>
                    <div className="file-icon-wrapper" ref={this.props.paymentRef}>
                        <img src={file} alt="file"/>
                    </div>
                    <div className="header">
                        Payment Initiation Data
                    </div>
                </CardHeader>
                <CardBody>
                    <ul className="payment-data-list">
                        <li className={!defaultBank ? 'missing' : 'present'}>
                            <span className="payment-left-text" onClick={() => this.props.startEdit('defaultBank')} >Default Bank</span>
                            <TextareaAutosize id="defaultBank" rows="1" placeholder="Missing" className="payment-right-text" value={!defaultBank ? '' : defaultBank} onChange={this.handleChange} />
                        </li>
                        <li className={!recipent ? 'missing' : 'present'}>
                            <span className="payment-left-text" onClick={() => this.props.startEdit('recipent')} >Recipent</span>
                            <TextareaAutosize id="recipient" rows="1" placeholder="Missing" className="payment-right-text" value={!recipent ? '' : recipent} onChange={this.handleChange} />
                        </li>
                        <li className={!iban ? 'missing' : 'present'}>
                            <span className="payment-left-text" onClick={() => this.props.startEdit('iban')} >IBAN</span>
                            <TextareaAutosize id="iban" rows="1" placeholder="Missing" className="payment-right-text" value={!iban ? '' : iban} onChange={this.handleChange} />
                        </li>
                        <li className={!amount ? 'missing' : 'present'}>
                            <span className="payment-left-text" onClick={() => this.props.startEdit('amount')} >Amount</span>
                            <TextareaAutosize id="amount" rows="1" placeholder="Missing" className="payment-right-text" value={!amount ? '' : amount} onChange={this.handleChange} />
                        </li>
                        <li className={!invoiceNR ? 'missing' : 'present'}>
                            <span className="payment-left-text" onClick={() => this.props.startEdit('invoiceNR')} >Invoice NR</span>
                            <TextareaAutosize id="invoiceNR" rows="1" placeholder="Missing" className="payment-right-text" value={!invoiceNR ? '' : invoiceNR} onChange={this.handleChange} />
                        </li>
                        <li className={!reference ? 'missing' : 'present'}>
                            <span className="payment-left-text" onClick={() => this.props.startEdit('reference')} >Reference</span>
                            <TextareaAutosize id="reference" rows="1" placeholder="Missing" className="payment-right-text" value={!reference ? '' : reference} onChange={this.handleChange} />
                        </li>
                    </ul>
                    <div className="confim-and-send">
                        <button disabled={!isFill} color="primary" className="btn-link btn-lg">Confirm & Send</button>
                    </div>
                </CardBody>
            </Card>
        )
    }
}
