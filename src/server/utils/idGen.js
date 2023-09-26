class IdGen {

    static currentID = 0;
    
    static getNextID() {
        return currentID++;
    }

};

module.exports = IdGen;