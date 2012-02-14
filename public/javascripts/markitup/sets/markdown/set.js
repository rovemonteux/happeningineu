// -------------------------------------------------------------------
// markItUp!
// -------------------------------------------------------------------
// Copyright (C) 2008 Jay Salvat
// http://markitup.jaysalvat.com/
// -------------------------------------------------------------------
// MarkDown tags example
// http://en.wikipedia.org/wiki/Markdown
// http://daringfireball.net/projects/markdown/
// -------------------------------------------------------------------
// Feel free to add more tags
// -------------------------------------------------------------------
mySettings = {
	previewParserPath:	'',
	onShiftEnter:		{keepDefault:false, openWith:'\n\n'},
	markupSet: [
		{name:'First Level Heading', key:'1', openWith:'# ', placeHolder:'H1...'},
		{name:'Second Level Heading', key:'2', openWith:'## ', placeHolder:'H2...'},
		{name:'Heading 3', key:'3', openWith:'### ', placeHolder:'H3...' },
		{name:'Heading 4', key:'4', openWith:'#### ', placeHolder:'H4...' },
		{name:'Heading 5', key:'5', openWith:'##### ', placeHolder:'H5...' },
		{name:'Heading 6', key:'6', openWith:'###### ', placeHolder:'H6...' },
		{separator:'---------------' },		
		{name:'Bold', key:'B', openWith:'**', closeWith:'**'},
		{name:'Italic', key:'I', openWith:'_', closeWith:'_'},
		{separator:'---------------' },
		{name:'Bulleted List', openWith:'- ' },
		{name:'Numeric List', openWith:function(markItUp) {
			return markItUp.line+'. ';
		}},
        {separator:'---------------' },
        {name:'Tag', key:'T', openWith:'#', closeWith:'[![Tag:!:happeningin]!]'},
        {separator:'---------------' },
		{name:'YouTube', key:'Y', openWith:'[![YouTube URL:!:https://www.youtube.com/]!]'},
        {name:'Dailymotion', key:'D', openWith:'[![Dailymotion URL:!:https://www.dailymotion.com/]!]'},
        {name:'Vimeo', key:'M', openWith:'[![Vimeo URL:!:https://www.vimeo.com/]!]'},
        {name:'guardian.co.uk', key:'G', openWith:'[![guardian.co.uk video URL:!:http://www.guardian.co.uk/world/video/]!]'}, 
        {separator:'---------------' },
        {name:'Podcast', key:'O', openWith:'[![Podcast .mp3 URL:!:https://site.com/podcast.mp3]!]'},
        {name:'Flash', key:'L', openWith:'[![Flash .swf URL:!:https://site.com/flash.swf]!]'},
        {separator:'---------------' },
        {name:'Map', key:'W', closeWith:'[![Map:!:Mikulov, Czech Republic]!]', openWith:'map: '}
	]
}

// mIu nameSpace to avoid conflict.
miu = {
	markdownTitle: function(markItUp, char) {
		heading = '';
		n = $.trim(markItUp.selection||markItUp.placeHolder).length;
		for(i = 0; i < n; i++) {
			heading += char;
		}
		return '\n'+heading;
	}
}
