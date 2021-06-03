const Datastore = require("nedb"),
  dbDialogs = new Datastore({ filename: "dialogs.db", autoload: true }),
  dbMessages = new Datastore({ filename: "messages.db", autoload: true });

exports.checkDialogs = async function() {
  dbDialogs.ensureIndex("global_id");
  dbDialogs.ensureIndex({ fieldName: "username", sparse: true }, (err) => {
    if (!!err) console.error(err);
  });
  //   dbDialogs.remove({});
  //   dbDialogs.remove({});
  //   dbDialogs.remove({});
  //   dbDialogs.remove({});
  //   dbDialogs.remove({});
  //   dbMessages.remove({});
  //   dbMessages.remove({});
  //   dbMessages.remove({});
  dbDialogs.find({ username: "Umbrella", owner: localStorage._id }, function(
    err,
    data
  ) {
    if (!!err) console.error(err);
    if (data.length == 0) {
      dbDialogs.insert(
        {
          owner: localStorage._id,
          username: "Umbrella",
          global_id: "60a0ea26c71ee62df88a9326",
        },
        function(err, data) {
          if (!!err) console.error(err);
          dbMessages.insert(
            [
              {
                dialog_id: data._id,
                sender_id: data.global_id,
                message: "Hi! My name is Umbrella. And you?",
                createAt: new Date().getTime(),
                isRead: true,
              },
              {
                dialog_id: data._id,
                sender_id: localStorage._id,
                message: "Hi, I'm " + localStorage.username,
                createAt: new Date().getTime() + 50,
                isRead: true,
              },
              {
                dialog_id: data._id,
                sender_id: data.global_id,
                message: "Nice to meet you. ❤️",
                createAt: new Date().getTime() + 100,
                isRead: false,
              },
            ],
            async function(err, data) {
              if (!!err) console.error(err);
              data = data[2];
              await dbMessages.count(
                { dialog_id: data.dialog_id, isRead: false },
                function(err, count) {
                  if (!!err) console.error(err);
                  dbDialogs.update(
                    { _id: data.dialog_id },
                    {
                      $set: {
                        lastMessage: data.message,
                        sender_id: data.sender_id,
                        datetime: data.createAt,
                        isRead: data.isRead,
                        isReadCount: count,
                      },
                    },
                    {}
                  );
                }
              );
            }
          );
        }
      );
    }
  });
};

exports.checkMessages = async function() {
  dbMessages.find({}).exec((err, data) => {
    //console.log(data);
  });
};
