import React, { Component } from 'react'
import { Card } from 'reactstrap'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { createWorker } from 'tesseract.js';

import spinner from '../../assets/img/spinner_white.svg'

export default class ChosenFile extends Component {

    state = {
        crop: undefined,
        croppedImageUrl: undefined,
    }

    zoomRef = React.createRef();
    zoomWrapRef = React.createRef();
    fileWrapper = React.createRef();
    fileRef = React.createRef();
    okBtnRef = React.createRef();

    onCropChange = (crop, percentCrop) => {
        this.setState({ crop: percentCrop });
    };


    componentDidUpdate(prevProps, prevState) {
        if (this.state.crop !== prevState.crop) {
            this.makeClientCrop(this.state.crop)
        }
        if (this.props.isEditing !== prevProps.isEditing) {
            if (this.okBtnRef.current && window.matchMedia("(max-width: 991px)").matches) {
                this.okBtnRef.current.scrollIntoView();
            }
            if (this.props.isEditing) {
                this.setState({ crop: { width: 30, height: 10, x: 35, y: 45, unit: '%' } }, () => {
                    this.okBtnRef.current.style.top = '45%';
                    this.okBtnRef.current.style.left = '50%';
                });
            } else {
                this.setState({ crop: { width: 0, height: 0, x: 0, y: 0, unit: '%' } });
            }
        }
        if (this.props.textReady && this.props.textReady !== prevProps.textReady) {
            const worker = createWorker({
                logger: m => this.setState({
                    textStatus: m.progress === 1 ? 'text-loaded' : m.status
                })
              });
                (async () => {
                    await worker.load();
                    await worker.loadLanguage('eng');
                    await worker.initialize('eng');
                    let { data: { text } } = await worker.recognize(this.state.croppedImageUrl);
                    const slicedText = text.slice(0, text.length-1)
                    await this.props.getText(slicedText)
                    await this.props.confirmText(false, this.state.crop, this.props.chosenFile.id);
                    await worker.terminate();
                  })();
        }
    }


    onImageLoaded = image => {
        this.imageRef = this.zoomRef.current;
    };
    
    onCropComplete = (crop, percentCrop) => {
        if (percentCrop.width) {
            this.makeClientCrop(percentCrop);
            this.okBtnRef.current.style.top = percentCrop.y + '%';
            this.okBtnRef.current.style.left = (percentCrop.x + percentCrop.width / 2) + '%';
        }
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
          const croppedImageUrl = await this.getCroppedImg(
            this.imageRef,
            crop,
            'newFile.jpeg'
          );
          this.setState({ croppedImageUrl });
        }
    }


    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = image.width * crop.width / 100;
        canvas.height = image.height * crop.height / 100;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          image,
          (image.width * crop.x / 100) * scaleX,
          (image.height * crop.y / 100) * scaleY,
          (image.width * crop.width / 100) * scaleX,
          (image.height * crop.height / 100) * scaleY,
          0,
          0,
          (image.width * crop.width / 100),
          (image.height * crop.height / 100)
        );
    
        return new Promise((resolve, reject) => {
          canvas.toBlob(blob => {
            if (!blob) {
              console.error('Canvas is empty');
              return;
            }
            blob.name = fileName;
            window.URL.revokeObjectURL(this.fileUrl);
            this.fileUrl = window.URL.createObjectURL(blob);
            resolve(this.fileUrl);
          });
        });
    }

    findCoords = (e, isMobile) => {
        if (e.target.classList.value.includes('ReactCrop__drag-handle')) {
            const rect = document.querySelector('.ReactCrop__image').getBoundingClientRect();
            const x = (e.target.getBoundingClientRect().left - rect.left) / rect.width * 100;
            const y = (e.target.getBoundingClientRect().top - rect.top) / rect.height * 100; 
            const clientX = isMobile ? e.touches[0].clientX : e.clientX;
            const clientY = isMobile ? e.touches[0].clientY : e.clientY;
            // const x = (clientX - rect.left) / rect.width * 100;
            // const y = (clientY - rect.top) / rect.height * 100; 
            console.log(clientY)
            this.zoomWrapRef.current.style.display = "block";
            this.zoomRef.current.style.transform = `translate(-${x-4.25}%, -${y-3.25}%)`;
            this.zoomWrapRef.current.style.top = ((clientY > 220)) ? `${clientY - rect.top - 150}px` : `${clientY - rect.top + 100}px`;
            this.zoomWrapRef.current.style.left = `${clientX - rect.left - 50}px`;
        } else {
            this.zoomWrapRef.current.style.display = "none";
        }
        
    }
    render() {
        // console.log(this.state)
        const { crop, textStatus } = this.state;
        const { isEditing, chosenFile } = this.props;
        return (
            <div>
                <Card className="chosen-file-card">
                    <div 
                        ref={this.fileWrapper} 
                        className="chosen-file-wrapper" 
                        onTouchStart={(e) => this.findCoords(e, true)}
                        onTouchEnd={() => this.zoomWrapRef.current.style.display = "none"}
                        onTouchMove={(e) => this.findCoords(e, true)} 
                        onMouseMove={(e) => this.findCoords(e, false)}
                    >
                        <ReactCrop 
                            ref={this.fileRef}
                            className="chosen-file-img"
                            src={this.props.chosenFile.file}
                            crop={crop}
                            ruleOfThirds
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                            disabled={!isEditing}
                            keepSelection={true}
                            minHeight={5}
                        />
                        {isEditing && 
                        <div className="accept-text" ref={this.okBtnRef}>
                            {textStatus === 'recognizing text' ? 
                            <img className="spinner" src={spinner} alt=""/> 
                            : 
                            <button className="accept-text-btn" onClick={() => this.props.confirmText(true)}>OK</button>}
                        </div>
                        }
                        <div ref={this.zoomWrapRef} className="zoomed-img-wrapper">
                            <img ref={this.zoomRef} className="zoomed-img" src={chosenFile.file} alt="Zoomed"/>
                            <div className="hc"></div>
                            <div className="vc"></div>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }
}
