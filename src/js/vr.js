function Vr360(opt) {
  this.opt = opt;
  this.vrBase = !!this.opt && !!this.opt.vrBase ? document.querySelector(this.opt.vrBase) : document.querySelector('.vr-area');
  this.initial = {
    vrPlate: this.vrBase.querySelector('.vr-360'), 
    vrList: this.vrBase.querySelector('.vr-360 .vr-360__default'), 
    vrImg: this.vrBase.querySelector('.vr-360 .vr-360__default img'),
    btnStart: this.vrBase.querySelector('.vr-360__btn'),
    btnColor: this.vrBase.querySelectorAll('.vr-list__color button'),
    color: this.vrBase.querySelector('.vr-list__color button.on').dataset.color,
    url: !!this.opt && !!this.opt.url ? this.opt.url : "https://www.kia.com/content/dam/kwcms/kr/ko/images/360vr/exterior/EDE-DEA/",
    folder: !!this.opt && !!this.opt.folder ? this.opt.folder : this.vrBase.querySelector('.vr-list__color button.on').dataset.color,
    fileName: this.vrBase.querySelector('.vr-list__color button.on').dataset.color,
    fileExp: !!this.opt && !!this.opt.fileExp ? this.opt.fileExp: "png",
    winWid: document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth,
    amount: !!this.opt && !!this.opt.amount ? this.opt.amount : 36,
    tarHgt: 0,
    tarWid: 0,
    firstX: 0,
    firstY: 0,
    isMove: false,
    is360: false,
    moveLeft: 0,
    moveTop: 0,
    direction: 0,
    reverse: !!this.opt && !!this.opt.reverse ? this.opt.reverse : false,
    curImg: 1,
    step: 0,
    trans: 0,
    num: 0,
    loading: false,
  }
  // 이미지 로드 확인
  this.imgInit = (src) => {
    return new Promise((resolve, reject) => {
      const _defaultImg = new Image();
      const _imgSrc = src;
      _defaultImg.src = _imgSrc;
      return _defaultImg.addEventListener("load", () => {
        resolve();
      })
    })
  }
  // 이미지 preload
  this.vrInit = () => {
    return new Promise((resolve, reject) => {
      let _images = [];
      let _num = 0;
      let _li = '';

      !!this.initial.vrList.querySelector('.vr-img__list') ? 
      this.initial.vrList.insertAdjacentHTML("beforeend", "<ul class='vr-img__list vr-img__second'></ul>")
      :
      this.initial.vrList.insertAdjacentHTML("afterbegin", "<ul class='vr-img__list vr-img__first'></ul>");

      for (let i = 1; i < this.initial.amount + 1; i++) {
        _images[i] = new Image();
        _images[i].src = `${this.initial.url}/${this.initial.folder}/${this.initial.fileName}_${i}.${this.initial.fileExp}`
        _li += `<li><img src='${this.initial.url}/${this.initial.folder}/${this.initial.fileName}_${i}.${this.initial.fileExp}'></li>`;
      }

      !!this.initial.vrList.querySelector('.vr-img__first') && this.initial.vrList.querySelector('.vr-img__first').classList.remove('vr-img__first')
      const _secondList = !!this.initial.vrList.querySelector('.vr-img__second') ? this.initial.vrList.querySelector('.vr-img__second') : this.initial.vrList.querySelector('.vr-img__list');
      _secondList.innerHTML = _li; 

      return _images.forEach((img) => {
        img.addEventListener("load", () => {
          _num++;
          if (_num  >= _images.length - 1) {
            this.initial.vrPlate.classList.contains("is") && !!this.initial.vrList.querySelector('.vr-img__list') && this.initial.vrList.removeChild(this.initial.vrList.querySelectorAll('.vr-img__list')[0])
            !!_secondList.classList.contains('vr-img__second') && _secondList.classList.remove('vr-img__second')

            resolve();
          }
        })
      })
    })
  }
  // 360 vr 시작
  this.vrStart = () => {
    this.loadingCheck(true);
    this.vrInit()
    .then(() => {
      this.initial.is360 = true;
      this.initial.vrPlate.classList.add("is")
      this.dragStart();
      this.loadingCheck(false);
      console.log('start');
    })
    return;
  }
  // loading
  this.loadingCheck = (type) => {
    this.initial.loading = type;
    const _loading = document.createElement('div');
    _loading.classList.add('loading');
    type && this.initial.vrPlate.append(_loading);
    !type && !!this.initial.vrPlate.querySelector('.loading') && this.initial.vrPlate.removeChild(this.initial.vrPlate.querySelector('.loading'));
  }
  // resize
  this.resizeWin = () => {
    this.initial.winWid = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
    this.initial.targetWid = this.initial.vrPlate.clientWidth;
    this.initial.step = Number((this.initial.tarWid / (this.initial.amount * 4)).toFixed(0));
    this.initial.tarWid = this.initial.vrPlate.clientWidth;
    this.initial.trans = this.initial.tarHgt * this.initial.num * -1;
    this.initial.vrPlate.style.height = this.initial.tarHgt + 'px';
    this.initial.vrList.style.transform = `translateY(${this.initial.trans}px)`;
  }

  // 초기 셋팅
  this.init = () => {
    window.addEventListener("resize", this.resizeWin);
    // 초기 이미지 높이 셋팅
    this.imgInit(this.initial.vrImg.src)
    .then(() => {
      this.initial.tarWid = this.initial.vrPlate.clientWidth;
      this.initial.step = Number((this.initial.tarWid / (this.initial.amount * 2)).toFixed(0));
      this.initial.tarHgt = this.initial.vrPlate.clientHeight;
      this.initial.vrPlate.style.height = this.initial.tarHgt + 'px';
      this.initial.vrPlate.classList.add('loadImg')
      this.clickColor()
    });
    // 360 vr 시작 버튼 클릭
    this.initial.btnStart.addEventListener('click', () => {
      this.vrStart()
    })
  }
  // 색상 버튼 클릭
  this.clickColor = () => {
    const _this = this
    this.initial.btnColor.forEach(function (item) {
      item.addEventListener('click', function () {
        if (_this.initial.loading) return;
        const _prevBtn = Array.prototype.filter.call(_this.initial.btnColor, (item) => {
          return item.classList.contains('on')
        })
        _prevBtn[0].classList.remove('on')
        this.classList.add("on");

        _this.initial.color = _this.initial.folder = _this.initial.fileName = this.dataset.color;
        if (!_this.initial.vrPlate.classList.contains("is")) {
          _this.initial.vrImg.src = `${_this.initial.url}/${_this.initial.color}/${_this.initial.color}_1.${_this.initial.fileExp}`;
        } else {
          _this.loadingCheck(true);
          _this.vrInit()
          .then(() => {
            _this.loadingCheck(false);
          });
        }
      })
    })
  }
  // 드래그
  this.dragStart = () => {
    const _this = this;
    window.addEventListener("keydown", function(e) {
      if (e.code === "ArrowLeft") {
        _this.initial.num++;  
      } else if (e.code === "ArrowRight") {
        _this.initial.num--;  
      }

      if (_this.initial.num >= _this.initial.amount) {
        _this.initial.num = 0;
      } else if (_this.initial.num < 1) {
        _this.initial.num = _this.initial.amount - 1
      }
      _this.initial.curImg = _this.initial.num;
      _this.imgChange(_this.initial.num)
    })
    _this.initial.vrPlate.addEventListener("mousedown", _this.mouseDown)
    _this.initial.vrPlate.addEventListener("touchstart", _this.mouseDown)
    window.addEventListener("mousemove", _this.mouseMove)
    window.addEventListener("touchmove", _this.mouseMove)
    window.addEventListener("mouseup", _this.mouseUp)
    window.addEventListener("touchend", _this.mouseUp)
    document.addEventListener("mouseout", function(e) {
      _this.mouseUp(e)
    });
  }
  this.mouseDown = (event) => {
    event.stopPropagation();

    this.initial.firstX = event.type !== "mousedown" ? event.touches[0].screenX : event.pageX;
    this.initial.firstY = event.type !== "mousedown" ? event.touches[0].screenY : event.pageY;

    this.initial.moveLeft = 0;
    this.initial.moveTop = 0;
    this.initial.isMove = true;
  }

  this.mouseMove = (event) => {
    if  (!this.initial.isMove) return;
    event.stopPropagation();

    const _moveX = event.type !== "mousemove" ? event.touches[0].screenX : event.pageX;
    const _moveY = event.type !== "mousemove" ? event.touches[0].screenY : event.pageY;

    this.initial.moveLeft = this.initial.firstX - _moveX;
    this.initial.moveTop = this.initial.firstY - _moveY;

    if (Math.abs(this.initial.moveLeft) > Math.abs(this.initial.moveTop)) {
      event.preventDefault();
      this.initial.direction = this.initial.moveLeft > 0 ?
        this.initial.reverse ? -1 : 1
        :
        this.initial.reverse ? 1 : -1;
      if (Math.abs(this.initial.moveLeft) >= this.initial.step) {
        this.initial.firstX = event.type !== "mousemove" ? event.touches[0].screenX : event.pageX;
        this.initial.firstY = event.type !== "mousemove" ? event.touches[0].screenY : event.pageY;
        this.changeCurNum();
      }
    } else {
      return;
    }
  }

  this.mouseUp = (event) => {
    if ( !this.initial.isMove) return;
    event.stopPropagation();
    event.preventDefault();
    this.initial.isMove = false;
  }

  this.changeCurNum = () => {
    this.initial.curImg = (this.initial.curImg + this.initial.direction) % this.initial.amount;
    if (this.initial.direction === -1 && this.initial.curImg < 1) {
      this.initial.curImg = this.initial.amount - 1;
    }
    this.imgChange();
  }
  this.imgChange = (num) => {
    this.initial.num =  !!num ? num : this.initial.curImg;
    this.initial.trans = this.initial.tarHgt * this.initial.num * -1;
    this.initial.vrList.style.transform = `translateY(${this.initial.trans}px)`;
    this.initial.vrList.dataset.idx = num;
  }
  this.init();
}