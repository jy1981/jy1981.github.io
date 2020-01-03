/*
	mameneogeo_wasm.js 需要做一些修改，注册key事件回调时，把回调参数保存到 keyCBParams 中
*/

var EMUInputBridge = EMUInputBridge || {};
var EMUInputIndex = {
	P1_Left: 0,
	P1_Right: 1,
	P1_Up: 2,
	P1_Down: 3,
	P1_A: 4,
	P1_B: 5,
	P1_C: 6,
	P1_D: 7,
	P1_E: 8,
	P1_F: 9,
	P1_Coin: 10,
	P1_Start: 11,

	P2_Left: 12,
	P2_Right: 13,
	P2_Up: 14,
	P2_Down: 15,
	P2_A: 16,
	P2_B: 17,
	P2_C: 18,
	P2_D: 19,
	P2_E: 20,
	P2_F: 21,
	P2_Coin: 22,
	P2_Start: 23,

	C_Reset: 24,
	C_Pause: 25,
	C_Resume: 26,

	Index_Max: 27,
}

var EMUInputKeys = [
	{key:'ArrowLeft', code:'ArrowLeft', keyCode:37},	//P1_Left
	{key:'ArrowRight', code:'ArrowRight', keyCode:39},  //P1_Right
	{key:'ArrowUp', code:'ArrowUp', keyCode:38},		//P1_Up
	{key:'ArrowDown', code:'ArrowDown', keyCode:40},	//P1_Down
	{key:'Control', code:'ControlLeft', keyCode:17},	//P1_A
	{key:'Alt', code:'AltLeft', keyCode:18},			//P1_B
	{key:' ', code:'Space', keyCode:32},				//P1_C
	{key:'Shift', code:'ShiftLeft', keyCode:16},		//P1_D
	{key:'z', code:'KeyZ', keyCode:90},					//P1_E
	{key:'x', code:'KeyX', keyCode:88},					//P1_F
	{key:'5', code:'Digit5', keyCode:53},				//P1_Coin
	{key:'1', code:'Digit1', keyCode:49},				//P1_Start

	{},		//P2_Left
	{},		//P2_Right
	{},		//P2_Up
	{},		//P2_Down
	{},		//P2_A
	{},		//P2_B
	{},		//P2_C
	{},		//P2_D
	{},		//P2_E
	{},		//P2_F
	{},		//P2_Coin
	{},		//P2_Start

	{},		//C_Reset
	{},		//C_Pause
	{},		//C_Resume
];

var EMUInputNetMode = {
	local: 0,
	netP1: 1,
	netP2: 2,
}

var EMUInputBridge = {
	Count: 0, 
	NetMode: 0,
	FixBuffer: [],
	CacheBuffer: [],

	init: function(){
		Count = EMUInputIndex.Index_Max;
		for(var i = 0; i < Count; i++){
			this.FixBuffer.push(0);
			this.CacheBuffer.push(0);
		}

		setNetMode(EMUInputNetMode.local);
	},

	setNetMode: function(netMode){
		if(netMode < EMUInputNetMode.local || netMode > EMUInputNetMode.netP2){
			return;
		}

		NetMode = netMode;
	},

	updateIndex: function(index){
		if(index >= Count){ return; }

		if(this.FixBuffer[index] != this.CacheBuffer[index]){
			var flag = this.FixBuffer[index] = this.CacheBuffer[index];
			var tpKey = EMUInputKeys[index];
			if(tpKey){
				if(flag == 0){ tpKey.type = 'keyup'; }
				else if(flag == 1){ tpKey.type = 'keydown'; }
				this.mameInputFunc(tpKey);
			}
		}
	},

	updateRange: function(base, count){
		for(var i = base; i < base+count; i++){
			this.updateIndex(i);
		}
	},

	update: function (){
		for(var i = 0; i < EMUInputIndex.Index_Max; i++){
			this.updateIndex(i);
		}
	},

	keyDown: function(index){
		if(index >= Count){ return; }

		this.CacheBuffer[index] = 1;
		this.updateIndex(index);
	},


	keyUp: function(index) {
		if(index >= Count){ return; }

		this.CacheBuffer[index] = 0;
		this.updateIndex(index);
	},

	keyPress: function(index, delay){
		if(index >= Count){ return; }
		delay = delay || 15;

		this.CacheBuffer[index] = 1;
		this.updateIndex(index);

		setTimeout(function() {
			EMUInputBridge.CacheBuffer[index] = 0; 
			EMUInputBridge.updateIndex(index);
			}, delay);
	},

	//left, right +1, up +2, down +3
	resetJoy: function(isP2){
		var baseIndex = isP2? EMUInputIndex.P2_Left : EMUInputIndex.P1_Left;

		this.CacheBuffer[baseIndex] = 0;
		this.CacheBuffer[baseIndex+1] = 0;
		this.CacheBuffer[baseIndex+2] = 0;
		this.CacheBuffer[baseIndex+3] = 0;
		this.updateRange(baseIndex, 4);
	},

	left: function(isP2){
		var baseIndex = isP2? EMUInputIndex.P2_Left : EMUInputIndex.P1_Left;

		this.CacheBuffer[baseIndex] = 1;
		this.CacheBuffer[baseIndex+1] = 0;
		this.CacheBuffer[baseIndex+2] = 0;
		this.CacheBuffer[baseIndex+3] = 0;
		this.updateRange(baseIndex, 4);
	},

	right: function(isP2){
		var baseIndex = isP2? EMUInputIndex.P2_Left : EMUInputIndex.P1_Left;

		this.CacheBuffer[baseIndex] = 0;
		this.CacheBuffer[baseIndex+1] = 1;
		this.CacheBuffer[baseIndex+2] = 0;
		this.CacheBuffer[baseIndex+3] = 0;
		this.updateRange(baseIndex, 4);
	},

	up: function(isP2){
		var baseIndex = isP2? EMUInputIndex.P2_Left : EMUInputIndex.P1_Left;

		this.CacheBuffer[baseIndex] = 0;
		this.CacheBuffer[baseIndex+1] = 0;
		this.CacheBuffer[baseIndex+2] = 1;
		this.CacheBuffer[baseIndex+3] = 0;
		this.updateRange(baseIndex, 4);
	},

	down: function(isP2){
		var baseIndex = isP2? EMUInputIndex.P2_Left : EMUInputIndex.P1_Left;

		this.CacheBuffer[baseIndex] = 0;
		this.CacheBuffer[baseIndex] = 0;
		this.CacheBuffer[baseIndex+2] = 0;
		this.CacheBuffer[baseIndex+3] = 1;
		this.updateRange(baseIndex, 4);
	},

	upLeft: function(isP2){
		var baseIndex = isP2? EMUInputIndex.P2_Left : EMUInputIndex.P1_Left;

		this.CacheBuffer[baseIndex] = 1;
		this.CacheBuffer[baseIndex+1] = 0;
		this.CacheBuffer[baseIndex+2] = 1;
		this.CacheBuffer[baseIndex+3] = 0;
		this.updateRange(baseIndex, 4);
	},

	upRight: function(isP2){
		var baseIndex = isP2? EMUInputIndex.P2_Left : EMUInputIndex.P1_Left;

		this.CacheBuffer[baseIndex] = 0;
		this.CacheBuffer[baseIndex+1] = 1;
		this.CacheBuffer[baseIndex+2] = 1;
		this.CacheBuffer[baseIndex+3] = 0;
		this.updateRange(baseIndex, 4);
	},

	downLeft: function(isP2){
		var baseIndex = isP2? EMUInputIndex.P2_Left : EMUInputIndex.P1_Left;

		this.CacheBuffer[baseIndex] = 1;
		this.CacheBuffer[baseIndex+1] = 0;
		this.CacheBuffer[baseIndex+2] = 0;
		this.CacheBuffer[baseIndex+3] = 1;
		this.updateRange(baseIndex, 4);
	},

	downRight: function(isP2){
		var baseIndex = isP2? EMUInputIndex.P2_Left : EMUInputIndex.P1_Left;

		this.CacheBuffer[baseIndex] = 0;
		this.CacheBuffer[baseIndex+1] = 1;
		this.CacheBuffer[baseIndex+2] = 0;
		this.CacheBuffer[baseIndex+3] = 1;
		this.updateRange(baseIndex, 4);
	},
	
	mameInputFunc: (function(e) {
		HEAP32[JSEvents.keyEvent + 64 >> 2] = e.location;
		HEAP32[JSEvents.keyEvent + 68 >> 2] = e.ctrlKey;
		HEAP32[JSEvents.keyEvent + 72 >> 2] = e.shiftKey;
		HEAP32[JSEvents.keyEvent + 76 >> 2] = e.altKey;
		HEAP32[JSEvents.keyEvent + 80 >> 2] = e.metaKey;
		HEAP32[JSEvents.keyEvent + 84 >> 2] = e.repeat;
		HEAP32[JSEvents.keyEvent + 152 >> 2] = e.charCode;
		HEAP32[JSEvents.keyEvent + 156 >> 2] = e.keyCode;
		HEAP32[JSEvents.keyEvent + 160 >> 2] = e.which;
	
		var params = keyCBParams[e.type];
		Module["dynCall_iiii"](params.callback, params.eventTypeId, JSEvents.keyEvent, params.userData);
	   }),
};

EMUInputBridge.init();