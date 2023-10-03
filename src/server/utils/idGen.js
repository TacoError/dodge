class IdGen {

    static currentID = 0;
    
    static getNextID() {
        return IdGen.currentID++;
    }

};

module.exports = IdGen;