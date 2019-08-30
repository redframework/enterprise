
/*

 ######  ####### ######   #####  ####### ######  ####### ######
 #     # #       #     # #     # #     # #     # #       #     #
 #     # #       #     # #       #     # #     # #       #     #
 ######  #####   #     # #       #     # #     # #####   ######
 #   #   #       #     # #       #     # #     # #       #   #
 #    #  #       #     # #     # #     # #     # #       #    #
 #     # ####### ######   #####  ####### ######  ####### #     #

 RedCryption.js
 Version 1.0.4
 Coded By RedCoder

 Uses Gibberish-AES javascript library
 Uses jsbn/RSA javascript library

 */

var RedCryption = {
    aeskey: null,
    aeskeyElement: null,
    separator1: " /=/ ",
    separator2: " /~/ ",
    
    init: function()
    {
        if(typeof(sessionStorage) == 'undefined'){
            alert("Error: Session storage not available.");
            return false;
        }
        
        // Get RSA public key (hex)
        element = document.querySelector('meta[name="sessionkey"]');
        if (element == null) return false;    
        RSApublic = element.getAttribute("content");
        var rsakey = new RSAKey();
        rsakey.setPublic(RSApublic, "10001");

        if (RSApublic !== sessionStorage.getItem("rsak")){
            this.reset();
            sessionStorage.setItem("rsak", RSApublic);
        }
        
        if (sessionStorage.getItem("aesk") === null){
            // Generate AES session key
            this.aeskey = this.getRandomStr(32);
            sessionStorage.setItem("aesk", this.aeskey);

            // Prepare input element for encrypted AES session key
            this.aeskeyElement = document.createElement('input');
            this.aeskeyElement.type = 'hidden';
            this.aeskeyElement.name = 'RedCryption_key';
            this.aeskeyElement.value = rsakey.encrypt(this.aeskey);
        } else {
            this.aeskey = sessionStorage.getItem("aesk");
        }
        return true;
    },
    
    reset: function()
    {
        sessionStorage.removeItem("aesk");
        this.aesKey = null;
    },
    
    getRandomStr: function(length)
    {
        chars = "8<yz)AR;BOP?SQ=9T}D:N2*Zd'U5v=Jb.cef_7gEY6lmh#aC/FIu3>0Lt(wM]-V&Wq,G4+H[KXj%kin{1o$pr!sx";
        result = "";
        while (result.length < length){
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },
    
    md5: function(str)
    {
        return GibberishAES.a2h(GibberishAES.Hash.MD5(GibberishAES.s2a(str)));
    },
    
    encrypt: function(formId)
    {
        form = document.getElementById(formId);
        if (!this.init()) return false;
        union = "";
        for (i = 0; i < form.elements.length; i++){
            if (form.elements[i].name != ''){
                union += form.elements[i].name + this.separator1;
                union += form.elements[i].value + this.separator2;
            }
            form.elements[i].name = '';
            form.elements[i].value = '';
        }
        union += 'RedCryption_form' + this.separator1 + formId;

        if (this.aeskeyElement !== null) form.appendChild(this.aeskeyElement);
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'RedCryption';
        input.value = GibberishAES.enc(union, this.aeskey);
        form.appendChild(input);
        return true;
    },
    
    decrypt: function(data)
    {
        this.aeskey = sessionStorage.getItem("aesk");
        if (this.aeskey === null || data === null) return false;
        
        decrypted = GibberishAES.dec(data, this.aeskey);
        var key = [];
        var form = null;

        pairs = decrypted.split(this.separator2);
        for (i=0; i<pairs.length; i++){
            pair = pairs[i].split(this.separator1);
            if (pair[0] == 'RedCryption_form'){
                form = document.getElementById(pair[1]);    
            } else {
                if (pair[0] != '') key[pair[0]] = pair[1];
            }
        }
        
        if (form == null) return false;
        
        for (i = 0; i < form.elements.length; i++){
            form.elements[i].value = key[form.elements[i].name];        
        }
        
        return true;
    }
};