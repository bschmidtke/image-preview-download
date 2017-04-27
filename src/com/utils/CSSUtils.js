export function getStyleSheet( id ) {
    // Add new style tag so we can append out test styles to it, this should override the skin css file
    // that is linked into the application.
    const element = document.getElementById( id );
    if(element) return element.sheet;
    return null;
}

export function addStyleSheet( id ) {
    let element = document.getElementById( id );
    if(!element) {
        // Add new style tag so we can append styles to it, allowing us to override css styles.
        const styleEl = document.createElement('style');
        element = document.head.appendChild( styleEl );
        element.setAttribute('id', id);
    }
    return element;
}

export function addStyleToStyleSheet(styleSheet, style) {
    if(!styleSheet || !style) return null;

    try {
        removeStyleFromStyleSheet( styleSheet, style );
        return styleSheet.insertRule(style.cssText, styleSheet.cssRules.length);
    } catch (e) {
        // We are blindly injecting css into the browser regardless if it is compatable
        // with the browser we are running in.
        // An error can occur when the browser doesn't support other browser specific settings.
        // Webkit vs. IE vs. Mozilla
        console.warn(e);
    }
}

export function addStylesToStyleSheet(styleSheet, styles) {
    if(!styleSheet || !Array.isArray(styles)) return;

    // Map over the styles and inject them into the style tag.
    styles.map(function (style) {
        addStyleToStyleSheet( styleSheet, style );
    });
}

export function getStyleIndex( stylesheet, style ) {
    // stylesheet.rules[ CSSRuleList ]
    // selectorText
    // cssText
    const selectorCompare = style.selectorText.toLowerCase();
    const selectorCompare2 = selectorCompare.substr(0, 1) === '.' ? selectorCompare.substr(1) : '.' + selectorCompare;

    const myRules = stylesheet.cssRules ? stylesheet.cssRules : stylesheet.rules;
    for (let j = 0; j < myRules.length; j++) {
        if (myRules[j].selectorText) {
            const check = myRules[j].selectorText.toLowerCase();
            switch (check) {
                case selectorCompare:
                case selectorCompare2:
                    return j;
            }
        }
    }
}

// Note, this doesn't work with Internet Explorer because they change the css selector text
// once it is injected into the DOM.
// TODO: Make compatible with IE.
export function removeStyleFromStyleSheet( styleSheet, style ) {
    if(!styleSheet || !style) return null;

    try {
        const index = getStyleIndex( styleSheet, style );
        if(index > -1) {
            return styleSheet.deleteRule( index );
        }
        return null;
    } catch (e) {
        // This can happen if the browser doesn't support other browser specific settings.
        // webkit vs. ie vs. mozilla
        console.warn(e);
    }
}

// Returns an object containing the constructed css text, along with the selector text.
export function createStyle( selectorText, cssText ) {
    return {
        // Used for searching for the selector in the style sheet or removing this selector from the StyleSheet.
        selectorText: selectorText,
        // The CSS we will use eventually.
        cssText: (selectorText + " " + cssText)
    }
}

export function createBackgroundImageStyle( selector, imageUrl ) {
    return createStyle( selector,
        "{ background-image: url('" + imageUrl + "') }");
}

export function createBackgroundDataImageStyle( selector, data ) {
    return createStyle( selector,
        "{ background-image: url(" + data + ") }");
}

// Flattens an array of strings into a single string.
export function CSSArrayToString( value ) {
    if(!Array.isArray(value)) return value;
    if(value.length == 0) return "";

    const results = value.reduce(function(acc, val) {
        if(!acc) return val;
        return acc + "\n" + val ;
    });
    return results;
}