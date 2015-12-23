var Slack, autoMark, autoReconnect, slack, token;

Slack = require ('..')

token = 'xoxb-16399510402-PO81SMTTKAMUQjEV7p1r2Jbd';

autoReconnect = true;

autoMark = true;

fs = require('fs')

slack = new Slack(token, autoReconnect, autoMark);

var chanResp = function(channel, response) {
	channel.send(response);
	return console.log("@" + slack.self.name + " responded with \"" + response + "\"");
}

slack.on('open', function() {
	var channel, channels, group, groups, id, messages, unreads;
	channels = [];
	groups = [];
	unreads = slack.getUnreadCount();
	channels = (function() {
		var _ref, _results;
		_ref = slack.channels;
		_results = [];
		for (id in _ref) {
			channel = _ref[id];
			if (channel.is_member) {
				_results.push("#" + channel.name);
			}
		}
		return _results;
	})();
	groups = (function() {
		var _ref, _results;
		_ref = slack.groups;
		_results = [];
		for (id in _ref) {
			group = _ref[id];
			if (group.is_open && !group.is_archived) {
				_results.push(group.name);
			}
		}
		return _results;
	})();

	console.log("Welcome to Slack. You are @" + slack.self.name + " of " + slack.team.name);
	console.log('You are in: ' + channels.join(', '));
	console.log('As well as: ' + groups.join(', '));
	messages = unreads === 1 ? 'message' : 'messages';
	return console.log("You have " + unreads + " unread " + messages);

});

slack.on('message', function(message) {
	var channel, channelError, channelName, errors, response, text, textError, ts, type, typeError, user, userName;
	channel = slack.getChannelGroupOrDMByID(message.channel);
	user = slack.getUserByID(message.user);
	response = '';
	type = message.type, ts = message.ts, text = message.text;
	channelName = (channel != null ? channel.is_channel : void 0) ? '#' : '';
	channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');
	userName = (user != null ? user.name : void 0) != null ? "@" + user.name : "UNKNOWN_USER";
	
	// EVENTS AND SHIT
	if (type === 'message' && (text != null) && (channel != null)) {
		//team_cleve
		if (channelName == 'team_cleve') {
			//all users
			if (userName != null) {
				//parrot facts
				if (text.match('^!parrot.*') != null) {
					fs.readFile('/home/thegreekbrit/parrot/slack-client/parrot/facts.js', 'utf8', function (err,data) {
						if (err) {
							return console.log(err);
						}
						var fact = data.split('\n');
						response = "DID YOU KNOW: " + fact[Math.floor(Math.random()*fact.length)] + " :partyparrot:";
						chanResp(channel, response);
					});
				}
			}
			//bcleve
			if (userName == '@bcleveland') {
				//link
				if (text.match('http(s?):\/\/') != null) {
					response = ':dance_parrot: BCLEVE IN YOURSELF :dance_parrot:';
					chanResp(channel, response);
				}
			}
		}
		
		//secret cleve chat
		else if (channelName == 'supersecretclevechat') {
			//all users
			if (userName != null) {
				//parrot facts
				if (text.match('^!parrot.*') != null) {
					fs.readFile('/home/thegreekbrit/parrot/slack-client/parrot/facts.js', 'utf8', function (err,data) {
						if (err) {
							return console.log(err);
						}
						var fact = data.split('\n');
						response = "DID YOU KNOW: " + fact[Math.floor(Math.random()*fact.length)] + " :partyparrot:";
						chanResp(channel, response);
					});
				}
			}
			//bcleve
			if (userName == '@bcleveland') {
				//haha or lol
				if (text.match('.*([hH][aA][hH][aA])|([Ll][Oo][Ll]).*') != null) {
					response = ':partyparrot: :dance_parrot: :dance_parrot2: :dance_parrot3: BCLEVE IN YOURSELF :dance_parrot3: :dance_parrot2: :dance_parrot: :partyparrot:';
					chanResp(channel, response);
				}
			}
		}
		//bottest
		else if (channelName == 'bottest_ahouston') {
			//ahouston 
			if (userName != null) {
				//test123
				if (text.match('test123') != null) {
					response = ':dance_parrot2: :dance_parrot2: :dance_parrot2:';
					chanResp(channel, response);
				}
				//parrot facts
				else if (text.match('^!parrot.*') != null) {
					fs.readFile('/home/thegreekbrit/parrot/slack-client/parrot/facts.js', 'utf8', function (err,data) {
						if (err) {
							return console.log(err);
						}
						var fact = data.split('\n');
						response = "DID YOU KNOW: " + fact[Math.floor(Math.random()*fact.length)] + " :partyparrot:";
						chanResp(channel, response);
					});
				}
			}
		}
		//ahtest
		else if (channelName == 'ahtest') {
			//parrot facts
			if (text.match('^!parrot.*') != null) {
				fs.readFile('/home/thegreekbrit/parrot/slack-client/parrot/facts.js', 'utf8', function (err,data) {
					if (err) {
						return console.log(err);
					}
					var fact = data.split('\n');
					response = "DID YOU KNOW: " + fact[Math.floor(Math.random()*fact.length)] + " :partyparrot:";
					chanResp(channel, response);
 				});
			}
			//func test
			else if (text.match('testing') != null) {
				response = "yes";
				chanResp(channel, response);
			}
		}
	}
	else {
		typeError = type !== 'message' ? "unexpected type " + type + "." : null;
		textError = text == null ? 'text was undefined.' : null;
		channelError = channel == null ? 'channel was undefined.' : null;
		errors = [typeError, textError, channelError].filter(function(element) {
			return element !== null;
		}).join(' ');
	}
});

slack.on('error', function(error) {
	return console.error("Error: " + error);
});

slack.login();
