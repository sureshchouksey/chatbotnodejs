var Chat = require('../controllers/chat');

module.exports = function (app) {

    app.route('/')
        .get(Chat.home);
    //console.log(app);
    app.route('/chat')
        .post(Chat.getAll);
    app.route('/getAllChat')
        .get(Chat.getAllChat)
    app.route('/insertChat')
        .post(Chat.insert);
    app.route('/insertMany')
        .get(Chat.insertMany)
    app.route('/chatCount')
        .get(Chat.count);
    app.route('/index')
        .get(Chat.index);
    app.route('/deleteAllChat')
        .delete(Chat.deleteAllChat);
    app.route('/updateChat')
        .put(Chat.updateChat);
        
}