import React from 'react';
import PropTypes from 'prop-types';

class ImageSelector extends React.Component {

    constructor(props) {
        super( props );
    }

    handleFileSelect( event ) {
        const files = event.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (let i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            const callback = this.props.onImageLoaded;
            const reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    // Render thumbnail.
                    var fileName = encodeURI(theFile.name);
                    var data = e.target.result;
                    if(callback)
                        callback(fileName, data);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }

    render () {
        const displayText = (!this.props.fileName) ? this.props.defaultText : this.props.fileName;
        return (
            <div onClick={ (evt) => this.inputSelector.click() }
                 className="flex-box horizontal vertical-center icon-name">
                { displayText }
                <input ref={ (cmpt) => { this.inputSelector = cmpt; } }
                       type="file"
                       className="image-selector-input"
                       onChange={ this.handleFileSelect.bind(this)}/>
            </div>
        )
    }
}

ImageSelector.propTypes = {
    defaultText: PropTypes.string.isRequired,
    fileName: PropTypes.string,
    onImageLoaded: PropTypes.func.isRequired
};

ImageSelector.defaultProps = {
    defaultText: "Select Image",
    fileName: null,
    onImageLoaded: ( fileName, imageData ) => {}
};

export default ImageSelector