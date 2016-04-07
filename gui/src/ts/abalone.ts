class Koordinata {
    constructor (public x: number = 0, public y: number = 0, public z: number = 0) { }
}

class Kamen {
    div: HTMLElement;

    constructor(
        public tabla: Tabla,
        public koordinata: Koordinata = new Koordinata(),
        public boja: string = '-'
    ) { }

    stampaj(size:number = 67): void {
        var kamen = document.createElement('div');

        // koji je znak na kamenu
        kamen.classList.add('polje');
        kamen.classList.add('polje-' + this.boja);

        var x = this.koordinata.x * size;
        var y = this.koordinata.y * size;
        var z = this.koordinata.z * size;

        var left = x + z / 2;
        var top  = z;
        top -= this.koordinata.z * 9;

        // Korekcija da bude u centar
        //top  += (- size / 2 + 5 * size * Math.sqrt(3.0) / 2);
        top  += (- size / 2 + 5 * size);
        left += (- size / 2 + 5 * size);

        kamen.style.top = top.toString() + 'px';
        kamen.style.left = left.toString() + 'px';



        // upis u kamen nase koordinate
        kamen.innerHTML = '<span class="koordinate cubic">' + this.koordinata.x + ', ' + this.koordinata.y + ', ' + this.koordinata.z + '</span>';

        // upis u kamen, aksijalne kooridnate
        var pbroj = this.koordinata.z;
        pbroj = 2 * tabla.velicina - 1 - pbroj;
        var p = String.fromCharCode(93 + (pbroj - 1)).toUpperCase();
        var q = (this.koordinata.x) + 2 * tabla.velicina - 5;
        kamen.innerHTML += '<span class="koordinate axial">' + p + q + '</span>';

        document.getElementById("tabla-id").appendChild(kamen);
        this.div = kamen;
        this.div.onclick = (e) => {
            this._onclick();
        }
    }

    _onclick() {
        this.tabla.toggleKamen(this);
    }
}

class Tabla {
    polja: Kamen[];
    selektirani: Kamen[];

    constructor(public velicina: number) {
        this.polja = new Array<Kamen>(3 * velicina * velicina - 3 * velicina + 1); // 3n² - 3n + 1
        for (var i = 0; i < this.polja.length; i++) {
            this.polja[i] = new Kamen(this);
        }

        var index = 0;
        for (var z = -(velicina - 1); z <= (velicina - 1); z++) {
            var duzinaReda = 2 * velicina - 1 - Math.abs(z); // duzinaReda + abs(z) = 2*velicina -1
            var x, y;
            if (z <= 0) {
                // gornja polovina, sa polovinom
                y = velicina - 1;
                x = 0 - z - y;
            } else {
                // donja polovina
                x = -(velicina - 1);
                y = 0 - x - z;
            }
            for (var i = 0; i < duzinaReda; i++) {
                this.polja[index].koordinata.x = x + i;
                this.polja[index].koordinata.y = y - i;
                this.polja[index].koordinata.z = z;
                index++;
            }
        }

        this.selektirani = [];
    }

    nacrtaj(): void {
        this.selektirani = [];
        document.getElementById('selektirani').innerHTML = '';
        var HTMLtabla = document.getElementById('tabla-id');
        HTMLtabla.innerHTML = '';
        var size:number = 70; // velicina kamencica
        for (var i = 0; i < this.polja.length; i++) {
            this.polja[i].stampaj(size);
        }

        var width:number  = 2 * 5 * size;
        //var height:number = 5 * size * Math.sqrt(3.0);
        HTMLtabla.style.width  = String(width) + "px";
        HTMLtabla.style.height = String(width) + "px";
    }

    toggleKamen(kamen: Kamen): void {
        var index = this.selektirani.indexOf(kamen);
        if (index == -1) {
            // nema ga
            this.selektirajKamen(kamen);
        } else {
            // ima ga
            this.deselektirajKamen(kamen);
        }

        // Apdejtovanje DIV-a
        var string = '';
        for (var i = 0; i < tabla.selektirani.length; i++) {
            string += '<li>';
            string += tabla.selektirani[i].koordinata.x + ', ' + tabla.selektirani[i].koordinata.y + ', ' + tabla.selektirani[i].koordinata.z;
            string += '</li>';
        }
        document.getElementById('selektirani').innerHTML = string;
    }

    selektirajKamen(kamen: Kamen): void {
        // var size = this.selektirani.filter(function(value) {return value !== undefined}).length;
        if (this.selektirani.length >= 3) {
            this.selektirani[0].div.classList.remove('selektiran');
            this.selektirani.splice(0, 1);
        }
        this.selektirani.push(kamen);
        kamen.div.classList.add('selektiran');
    }

    deselektirajKamen(kamen: Kamen): void {
        var index = this.selektirani.indexOf(kamen);
        this.selektirani.splice(index, 1);
        kamen.div.classList.remove('selektiran');
    }

    nacrtajString(s: string): void {
        s = s.replace(/\s/g, ''); // skloni sve beline
        s = s.replace(/\"/g, ''); // skloni navodnike

        var brojX = 0;
        var brojO = 0;

        for (var i = 0; i < Math.min(tabla.polja.length, s.length); i++) {
            tabla.polja[i].boja = s[i];
            if (s[i] == 'x' || s[i] == 'X') {
              brojX++;
            }
            if (s[i] == 'o' || s[i] == 'O') {
              brojO++;
            }
        }

        brojX = 14 - brojX;
        brojO = 14 - brojO;

        var HTMLizguraniX = document.getElementById("izgurani-x");
        var HTMLizguraniO = document.getElementById("izgurani-o");
        HTMLizguraniX.innerHTML = '';
        HTMLizguraniO.innerHTML = '';

        for (var i = 0; i < brojX; i++) HTMLizguraniX.innerHTML += '<div class="polje polje-x"></div>';
        for (var i = 0; i < brojO; i++) HTMLizguraniO.innerHTML += '<div class="polje polje-o"></div>';

        tabla.nacrtaj();
    }
}