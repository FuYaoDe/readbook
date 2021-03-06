import moment from 'moment';

describe("about BookService =>", () => {

  let testHost, testSite, testBook, testBook2;

  /* ================================ before ================================ */
  before(async (done) => {
    try {
      // create Host
      testHost = await db.Host.create({
        Host: 'testHost',
        desc: 'a Host for test',
        enable: true,
        weight: 1
      });

      // create site
      testSite =  await db.Site.create({
        name: 'test',
        avatar: '',
        type: 'OTHER',
        desc: '',
        banner: '',
        photos: []
      });
      await testSite.setHosts(testHost.id);

      // create books
      testBook = await db.Book.create({
        uuid: 'a1tw-32sd-23dfs-3f24-sdff-fs3s',
        name: 'testBook1',
        desc: 'this is a test book',
        author: 'kuyen',
        pages: '100',
        location: '/a/1/a1tw-32sd-23dfs-3f24-sdff-fs3s',
        cover: 'a1tw-32sd-23dfs-3f24-sdff-fs3s.jpg',
        isPublish: true,
        viewCount: 1
      });
      await testBook.setSites(testHost.id);
      testBook2 = await db.Book.create({
        uuid: 'h34v-fs3s-23dfs-fs3s-23dfs-3f24',
        name: 'testBook2',
        desc: 'this is a test book',
        author: 'kuyen',
        pages: '100',
        location: '/h/3/h34v-32sd-23dfs-3f24-sdff-fs3s',
        cover: 'h34v-32sd-23dfs-3f24-sdff-fs3s.jpg',
        isPublish: true,
        viewCount: 2
      });
      await testBook2.setSites(testHost.id);
      done();
    } catch (e) {
      console.log(e.stack);
      done(e);
    }
  });

  /* ============================== start test ============================== */

  // query-all
  it('list all books',async (done) => {
    let queryObj = {}, queryResults;
    try {
      queryResults = await BookService.bookQuery(queryObj);
      console.log(queryResults);
      queryResults.count.should.be.above(0);
      queryResults.rows.forEach(book => {
        console.log('=== total books:',queryResults.rows.length,'=== book.id ==>',book.id);
      });
      done();
    } catch (e) {
      done(e);
    }
  });
  // end

  // query-by-name
  it('Querying book by name', async (done) => {
    let queryObj = {}, queryResults;
    try{
      queryObj.name = 'testBook1';
      queryResults = await BookService.bookQuery(queryObj);
      // console.log('=== name queryResults ==>',queryResults);
      queryResults.count.should.be.above(0);
      queryResults.rows.forEach(book => {
        let name = book['name'];
        name.should.be.include(queryObj.name);
        console.log('=== condition:',queryObj,'=== book.id ==>',book.id);
      });
      done();
    } catch (e) {
      done(e);
    }
  });
  // end

  // query-by-isPublish
  it('Querying book by isPublish', async (done) => {
    let queryObj = {}, queryResults;
    try{
      queryObj.isPublish = true;
      queryResults = await BookService.bookQuery(queryObj);
      // console.log('=== author queryResults ==>',queryResults);
      // check fields
      queryResults.count.should.be.above(0);
      queryResults.rows.forEach(book => {
        let isPublish = book['isPublish'];
        isPublish.should.be.equal(queryObj.isPublish);
        console.log('=== condition:',queryObj,'=== book.id ==>',book.id);
      });
      done();
    } catch (e) {
      done(e);
    }
  });
  // end

  // query-by-author
  it('Querying book by author', async (done) => {
    let queryObj = {}, queryResults;
    try{
      queryObj.author = 'kuyen';
      queryResults = await BookService.bookQuery(queryObj);
      // console.log('=== author queryResults ==>',queryResults);
      // check fields
      queryResults.count.should.be.above(0);
      queryResults.rows.forEach(book => {
        let author = book['author'];
        author.should.be.include(queryObj.author);
        console.log('=== condition:',queryObj,'=== book.id ==>',book.id);
      });
      done();
    } catch (e) {
      done(e);
    }
  });
  // end

  // query-by-sites
  it('Querying book by its belonged site', async (done) => {
    let queryObj = {}, queryResults;
    try{
      queryObj.siteId = testSite.id;
      queryResults = await BookService.bookQuery(queryObj);
      // console.log('=== author queryResults ==>',queryResults);
      // check fields
      queryResults.count.should.be.above(0);
      queryResults.rows.forEach(book => {
        book.Sites[0].SiteBook.SiteId.should.be.equal(testSite.id);
        console.log('=== condition:',queryObj,'=== book.id ==>',book.id);
      });
      done();
    } catch (e) {
      done(e);
    }
  });
  // end

  // create-book
  it('Create a book', async (done) => {
    try{
      // create book
      let testBook = await BookService.create({
        uuid: 'z23f-32sd-23dfs-3f24-sdff-fs3s',
        name: 'trunk-studio-guide',
        desc: 'a book about trunk-studio',
        author: 'trunkers',
        pages: '23',
        location: '/z/2/z23f-32sd-23dfs-3f24-sdff-fs3s',
        cover: 'z23f-32sd-23dfs-3f24-sdff-fs3s.jpg',
        isPublish: true,
        viewCount: 498
      });
      // check result
      let findBook = await db.Book.find({
        where:{
          name: testBook.name
        }
      });
      console.log('=== findBook ==>\n',findBook.toJSON());
      // check fields
      findBook.should.be.Object;
      findBook.id.should.be.number;
      findBook.name.should.be.equal(testBook.name);
      done();
    } catch (e) {
      done(e);
    }
  });
  // end

  // update-book
  it('Update a book', async (done) => {
    let updateBook, findBook;
    try{
      // 1st: update book
      updateBook = await BookService.update({
        id: testBook.id,
        uuid: testBook.uuid,
        name: 'testBook1updated',
        desc: 'updatedBook',
        author: 'unknown',
        pages: testBook.pages,
        location: testBook.location,
        cover: testBook.cover,
        isPublish: testBook.isPublish,
        viewCount: 10
      });
      console.log('=== updateBook ==>\n',updateBook.toJSON());
      // 2nd: check result
      findBook = await db.Book.find({
        where:{
          id: testBook.id
        }
      });
      console.log('=== findBook ==>\n',findBook.toJSON());
      // check fields
      findBook.should.be.Object;
      findBook.id.should.be.equal(testBook.id);
      findBook.name.should.be.equal(updateBook.name);
      findBook.desc.should.be.equal(updateBook.desc);
      findBook.author.should.be.equal(updateBook.author);
      findBook.viewCount.should.be.equal(updateBook.viewCount);
      done();
    } catch (e) {
      done(e);
    }
  });
  // end

  // delete-book
  it('Delete a book', async (done) => {
    let updateBook, findBook;
    try{
      // 1st: create book
      let testBook = await db.Book.create({
        uuid: 'z23f-32sd-23dfs-3f24-sdff-fs3s',
        name: 'i will be delete',
        desc: 'a book',
        author: 'trunkers',
        pages: '23',
        location: '/z/2/z23f-32sd-23dfs-3f24-sdff-fs3s',
        cover: 'z23f-32sd-23dfs-3f24-sdff-fs3s.jpg',
        isPublish: true,
        viewCount: 498
      });
      // 2nd: delete it
      let deleteBook = await BookService.delete(testBook.id);
      console.log('=== deleteBook ==>\n',deleteBook);
      // check fields
      deleteBook.should.be.Object;
      deleteBook.id.should.be.number;
      deleteBook.deletedAt.should.be.date;
      done();
    } catch (e) {
      done(e);
    }
  });
  // end

});
// end describe
