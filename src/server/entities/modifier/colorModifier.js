class ColorModifier {

    constructor(initialColor) {
        this.initialColor = initialColor;
        this.modifierColor = "";
        this.modifierLength = 0;
        this.initialColorHold = initialColor; // used by heroes like magmax when i need to revert, most likely a better way to do this.
    }

    tick() {
        if (this.modifierLength > 0) {
            this.modifierLength--;
        }
    }

    getColor() {
        if (this.modifierLength > 0) {
            return this.modifierColor;
        }
        return this.initialColor;
    }

    setModifier(color, forl) {
        this.modifierColor = color;
        this.modifierLength = forl;
    }

};

module.exports = ColorModifier;