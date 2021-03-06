module.exports = {

  // list all goods result, include query items
  read: async (req, res) => {
    let query = req.query;
    console.log('=== E-Reader: read : input query ==>\n',query);
    try {
      // book inforations
      let bookName = query.name;
      let pageTotal = query.pages;
      let fileLocation = query.loc;
      let fileName = query.uuid;

      // make a fake book
      fileLocation = '/images/ereader/book-sample';
      fileName = 'sample';

      // merge-file-name-location-to-book-array
      var pages = [];
      var pad = function(number, length) {
        var str = '' + number;
        while (str.length < length) {
          str = '0' + str;
        }
        return str;
      }
      for (var i = 1; i <= pageTotal; i++) {
        pages.push({index: i-1, url: fileLocation+'/'+fileName+'-'+pad(i, 3)+'.jpg'});
      }

      // marge output
      let result = {
        title : bookName,
        pages : pages,
        pageTotal : pageTotal,
        pageName: "/ereader"
      };
      console.log('=== E-Reader: read : result ==>\n',result);

      // this is for multiple-output
      if (query.responseType && query.responseType.toLowerCase() == 'json')
        return res.ok(result);
      else
        return res.view('ereader/ereader', result);
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  }


}
