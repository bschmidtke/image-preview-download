import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { CSSArrayToString } from './CSSUtils';

export function buildImagePath( imageDirectory, fileName ) {
    if(!fileName || !fileName.trim()) return null;
    if(!imageDirectory || !imageDirectory.trim())
        return "./" + fileName;

    return "./" + imageDirectory + "/" + fileName;
}

export function download( styles,
                          files,
                          cssFileName = "styles.css",
                          imageDirName = "images",
                          exportFileName = "style-export.zip" )  {

    if(!styles && !files) {
        // Nothing to export.
        return;
    }

    if(!cssFileName || !cssFileName.trim()) {
        // User didn't specify a css file name to write to.
        throw new Error("Invalid CSS File Name.");
    }

    if(files.length > 0 && (!imageDirName || !imageDirName.trim())) {
        // User didn't specify a image directory name to write to.
        throw new Error("Invalid Image Directory Name.");
    }

    if(!exportFileName || !exportFileName.trim()) {
        // User didn't specify a zip file name to write to.
        throw new Error("Invalid Export File Name.");
    }

    // If we received an array of styles, flatten it.
    if(Array.isArray(styles))
        styles = CSSArrayToString( styles );

    // prepare to Zip files.
    let zip = new JSZip();

    // append css
    if(styles)
        zip.file(cssFileName, styles);

    // append custom images.
    if(files && files.length > 0) {
        let img = zip.folder( imageDirName );
        files.map(( file ) => {
                const data = trimImageDataUrl(file.fileData);
                img.file(file.fileName, data, {base64: true})
            }
        )
    }

    zip.generateAsync({type: "blob"})
        .then(( content ) => downloadZipFile(exportFileName, content));
}

export function downloadZipFile( fileName, data ) {
    downloadFile( fileName, data );
}

export function downloadFile( fileName, data ) {
    FileSaver.saveAs( data, fileName );
}

// Since we know we are dealing with data urls, we need to trim this information off before writing a file.
export function trimImageDataUrl( data ) {
    const types = [
        "data:image/gif;base64,",
        "data:image/png;base64,",
        "data:image/jpg;base64,",
        "data:image/svg+xml;base64,"
    ];

    for(let prefix in types) {
        if (data.substr(0, types[prefix].length) === types[prefix]) {
            return data.substr(types[prefix].length, data.length);
        }
    }

    return data;
}