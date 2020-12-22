import React, { Component } from 'react'
import { 
    Card, 
    CardBody, 
    CardHeader,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem 
} from 'reactstrap'

import file from '../../assets/img/font-icons/pdf-icon-e.svg'

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

export default class FilesList extends Component {
    render() {
        return (
            <Card className="files-list-card">
                <CardHeader>
                    <div className="file-icon-wrapper">
                        <img src={file} alt="file"/>
                    </div>
                    <div className="number-of-files">
                        <UncontrolledDropdown>
                            <DropdownToggle caret>
                                Estonia (27)
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>Estonia</DropdownItem>
                                <DropdownItem>Litva</DropdownItem>
                                <DropdownItem>Latvia</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="file-list">
                        <SimpleBar style={{ maxHeight: '620px'}}>
                        { this.props.files.map((file, index) => {
                            return (
                                <div key={index} className={"file-list-item-wrapper" + (file.id === this.props.chosenFile.id ? ' active' : '')}>
                                    <img 
                                        onClick={() => this.props.chooseFile(file)} 
                                        className='file-list-item'
                                        src={file.file} 
                                        alt="file"
                                    />
                                </div>
                            )
                        })}
                        </SimpleBar>
                    </div>
                </CardBody>
            </Card>
        )
    }
}
