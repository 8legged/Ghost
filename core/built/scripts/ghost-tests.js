define("ghost/tests/test-helper", 
  ["ember-cli/test-loader","ember/resolver","ember-mocha"],
  function(__dependency1__, __dependency2__, __dependency3__) {
    "use strict";
    var TestLoader = __dependency1__["default"];
    var Resolver = __dependency2__["default"];
    var setResolver = __dependency3__.setResolver;

    var resolver = Resolver.create();
    resolver.namespace = {
      modulePrefix: 'ghost'
    };

    setResolver(resolver);

    TestLoader.load();

    window.expect = chai.expect;

    mocha.checkLeaks();
    mocha.globals(['jQuery', 'EmberInspector']);
    mocha.run();
  });
define("ghost/tests/unit/components/gh-trim-focus-input_test", 
  ["ember-mocha"],
  function(__dependency1__) {
    "use strict";
    /* jshint expr:true */
    var describeComponent = __dependency1__.describeComponent;
    var it = __dependency1__.it;

    describeComponent('gh-trim-focus-input', function () {
        it('trims value on focusOut', function () {
            var component = this.subject({
                value: 'some random stuff   '
            });

            this.render();

            component.$().focusout();
            expect(component.$().val()).to.equal('some random stuff');
        });

        it('does not have the autofocus attribute if not set to focus', function () {
            var component = this.subject({
                value: 'some text',
                focus: false
            });

            this.render();

            expect(component.$().attr('autofocus')).to.not.be.ok;
        });

        it('has the autofocus attribute if set to focus', function () {
            var component = this.subject({
                value: 'some text',
                focus: true
            });

            this.render();

            expect(component.$().attr('autofocus')).to.be.ok;
        });
    });
  });
define("ghost/tests/unit/components/gh-url-preview_test", 
  ["ember-mocha"],
  function(__dependency1__) {
    "use strict";
    /* jshint expr:true */
    var describeComponent = __dependency1__.describeComponent;
    var it = __dependency1__.it;

    describeComponent('gh-url-preview',
        function () {
            it('generates the correct preview URL with a prefix', function () {
                var component = this.subject({
                    prefix: 'tag',
                    slug: 'test-slug',
                    tagName: 'p',
                    classNames: 'test-class',

                    config: {blogUrl: 'http://my-ghost-blog.com'}
                });

                this.render();

                expect(component.get('url')).to.equal('my-ghost-blog.com/tag/test-slug/');
            });

            it('generates the correct preview URL without a prefix', function () {
                var component = this.subject({
                    slug: 'test-slug',
                    tagName: 'p',
                    classNames: 'test-class',

                    config: {blogUrl: 'http://my-ghost-blog.com'}
                });

                this.render();

                expect(component.get('url')).to.equal('my-ghost-blog.com/test-slug/');
            });
        }
    );
  });
define("ghost/tests/unit/models/post_test", 
  ["ember-mocha"],
  function(__dependency1__) {
    "use strict";
    /* jshint expr:true */
    var describeModel = __dependency1__.describeModel;
    var it = __dependency1__.it;

    describeModel('post',
        {
            needs:['model:user', 'model:tag', 'model:role']
        },

        function () {
            it('has a validation type of "post"', function () {
                var model = this.subject();

                expect(model.validationType).to.equal('post');
            });

            it('isPublished and isDraft are correct', function () {
                var model = this.subject({
                    status: 'published'
                });

                expect(model.get('isPublished')).to.be.ok;
                expect(model.get('isDraft')).to.not.be.ok;

                Ember.run(function () {
                    model.set('status', 'draft');

                    expect(model.get('isPublished')).to.not.be.ok;
                    expect(model.get('isDraft')).to.be.ok;
                });
            });

            it('isAuthoredByUser is correct', function () {
                var model = this.subject({
                    author_id: 15
                }),
                user = Ember.Object.create({id: '15'});

                expect(model.isAuthoredByUser(user)).to.be.ok;

                Ember.run(function () {
                    model.set('author_id', 1);

                    expect(model.isAuthoredByUser(user)).to.not.be.ok;
                });
            });

            it('updateTags removes and deletes old tags', function () {
                var model = this.subject();

                Ember.run(this, function () {
                    var modelTags = model.get('tags'),
                        tag1 = this.store().createRecord('tag', {id: '1'}),
                        tag2 = this.store().createRecord('tag', {id: '2'}),
                        tag3 = this.store().createRecord('tag');

                    // During testing a record created without an explicit id will get
                    // an id of 'fixture-n' instead of null
                    tag3.set('id', null);

                    modelTags.pushObject(tag1);
                    modelTags.pushObject(tag2);
                    modelTags.pushObject(tag3);

                    expect(model.get('tags.length')).to.equal(3);

                    model.updateTags();

                    expect(model.get('tags.length')).to.equal(2);
                    expect(model.get('tags.firstObject.id')).to.equal('1');
                    expect(model.get('tags').objectAt(1).get('id')).to.equal('2');
                    expect(tag1.get('isDeleted')).to.not.be.ok;
                    expect(tag2.get('isDeleted')).to.not.be.ok;
                    expect(tag3.get('isDeleted')).to.be.ok;
                });
            });
        }
    );
  });
define("ghost/tests/unit/models/role_test", 
  ["ember-mocha"],
  function(__dependency1__) {
    "use strict";
    var describeModel = __dependency1__.describeModel;
    var it = __dependency1__.it;

    describeModel('role', function () {
        it('provides a lowercase version of the name', function () {
            var model = this.subject({
                name: 'Author'
            });

            expect(model.get('name')).to.equal('Author');
            expect(model.get('lowerCaseName')).to.equal('author');

            Ember.run(function () {
                model.set('name', 'Editor');

                expect(model.get('name')).to.equal('Editor');
                expect(model.get('lowerCaseName')).to.equal('editor');
            });
        });
    });
  });
define("ghost/tests/unit/models/setting_test", 
  ["ember-mocha"],
  function(__dependency1__) {
    "use strict";
    var describeModel = __dependency1__.describeModel;
    var it = __dependency1__.it;

    describeModel('setting', function () {
        it('has a validation type of "setting"', function () {
            var model = this.subject();

            expect(model.get('validationType')).to.equal('setting');
        });
    });
  });
define("ghost/tests/unit/models/tag_test", 
  ["ember-mocha"],
  function(__dependency1__) {
    "use strict";
    var describeModel = __dependency1__.describeModel;
    var it = __dependency1__.it;

    describeModel('tag', function () {
        it('has a validation type of "tag"', function () {
            var model = this.subject();

            expect(model.get('validationType')).to.equal('tag');
        });
    });
  });
define("ghost/tests/unit/models/user_test", 
  ["ember-mocha"],
  function(__dependency1__) {
    "use strict";
    /*jshint expr:true */
    var describeModel = __dependency1__.describeModel;
    var it = __dependency1__.it;

    describeModel('user',
        {
            needs: ['model:role']
        },

        function () {
            it('has a validation type of "user"', function () {
                var model = this.subject();

                expect(model.get('validationType')).to.equal('user');
            });

            it('active property is correct', function () {
                var model = this.subject({
                    status: 'active'
                });

                expect(model.get('active')).to.be.ok;

                ['warn-1', 'warn-2', 'warn-3', 'warn-4', 'locked'].forEach(function (status) {
                    Ember.run(function () {
                        model.set('status', status);

                        expect(model.get('status')).to.be.ok;
                    });
                });

                Ember.run(function () {
                    model.set('status', 'inactive');

                    expect(model.get('active')).to.not.be.ok;
                });

                Ember.run(function () {
                    model.set('status', 'invited');

                    expect(model.get('active')).to.not.be.ok;
                });
            });

            it('invited property is correct', function () {
                var model = this.subject({
                    status: 'invited'
                });

                expect(model.get('invited')).to.be.ok;

                Ember.run(function () {
                    model.set('status', 'invited-pending');

                    expect(model.get('invited')).to.be.ok;
                });

                Ember.run(function () {
                    model.set('status', 'active');

                    expect(model.get('invited')).to.not.be.ok;
                });

                Ember.run(function () {
                    model.set('status', 'inactive');

                    expect(model.get('invited')).to.not.be.ok;
                });
            });

            it('pending property is correct', function () {
                var model = this.subject({
                    status: 'invited-pending'
                });

                expect(model.get('pending')).to.be.ok;

                Ember.run(function () {
                    model.set('status', 'invited');

                    expect(model.get('pending')).to.not.be.ok;
                });

                Ember.run(function () {
                    model.set('status', 'inactive');

                    expect(model.get('pending')).to.not.be.ok;
                });
            });

            it('role property is correct', function () {
                var model,
                    role;

                model = this.subject();

                Ember.run(this, function () {
                    role = this.store().createRecord('role', {name: 'Author'});

                    model.get('roles').pushObject(role);

                    expect(model.get('role.name')).to.equal('Author');
                });

                Ember.run(this, function () {
                    role = this.store().createRecord('role', {name: 'Editor'});

                    model.set('role', role);

                    expect(model.get('role.name')).to.equal('Editor');
                });
            });

            it('isAuthor property is correct', function () {
                var model = this.subject();

                Ember.run(this, function () {
                    var role = this.store().createRecord('role', {name: 'Author'});

                    model.set('role', role);

                    expect(model.get('isAuthor')).to.be.ok;
                    expect(model.get('isEditor')).to.not.be.ok;
                    expect(model.get('isAdmin')).to.not.be.ok;
                    expect(model.get('isOwner')).to.not.be.ok;
                });
            });

            it('isEditor property is correct', function () {
                var model = this.subject();

                Ember.run(this, function () {
                    var role = this.store().createRecord('role', {name: 'Editor'});

                    model.set('role', role);

                    expect(model.get('isEditor')).to.be.ok;
                    expect(model.get('isAuthor')).to.not.be.ok;
                    expect(model.get('isAdmin')).to.not.be.ok;
                    expect(model.get('isOwner')).to.not.be.ok;
                });
            });

            it('isAdmin property is correct', function () {
                var model = this.subject();

                Ember.run(this, function () {
                    var role = this.store().createRecord('role', {name: 'Administrator'});

                    model.set('role', role);

                    expect(model.get('isAdmin')).to.be.ok;
                    expect(model.get('isAuthor')).to.not.be.ok;
                    expect(model.get('isEditor')).to.not.be.ok;
                    expect(model.get('isOwner')).to.not.be.ok;
                });
            });

            it('isOwner property is correct', function () {
                var model = this.subject();

                Ember.run(this, function () {
                    var role = this.store().createRecord('role', {name: 'Owner'});

                    model.set('role', role);

                    expect(model.get('isOwner')).to.be.ok;
                    expect(model.get('isAuthor')).to.not.be.ok;
                    expect(model.get('isAdmin')).to.not.be.ok;
                    expect(model.get('isEditor')).to.not.be.ok;
                });
            });
        }
    );
  });
define("ghost/tests/unit/utils/ghost-paths_test", 
  ["ghost/utils/ghost-paths"],
  function(__dependency1__) {
    "use strict";
    /* jshint expr:true */

    var ghostPaths = __dependency1__["default"];

    describe('ghost-paths', function () {
        describe('join', function () {
            var join = ghostPaths().url.join;

            it('should join two or more paths, normalizing slashes', function () {
                var path;

                path = join('/one/', '/two/');
                expect(path).to.equal('/one/two/');

                path = join('/one', '/two/');
                expect(path).to.equal('/one/two/');

                path = join('/one/', 'two/');
                expect(path).to.equal('/one/two/');

                path = join('/one/', 'two/', '/three/');
                expect(path).to.equal('/one/two/three/');

                path = join('/one/', 'two', 'three/');
                expect(path).to.equal('/one/two/three/');
            });

            it('should not change the slash at the beginning', function () {
                var path;

                path = join('one/');
                expect(path).to.equal('one/');
                path = join('one/', 'two');
                expect(path).to.equal('one/two/');
                path = join('/one/', 'two');
                expect(path).to.equal('/one/two/');
                path = join('one/', 'two', 'three');
                expect(path).to.equal('one/two/three/');
                path = join('/one/', 'two', 'three');
                expect(path).to.equal('/one/two/three/');
            });

            it('should always return a slash at the end', function () {
                var path;

                path = join();
                expect(path).to.equal('/');
                path = join('');
                expect(path).to.equal('/');
                path = join('one');
                expect(path).to.equal('one/');
                path = join('one/');
                expect(path).to.equal('one/');
                path = join('one', 'two');
                expect(path).to.equal('one/two/');
                path = join('one', 'two/');
                expect(path).to.equal('one/two/');
            });
        });
    });
  });
//# sourceMappingURL=ghost-tests.js.map