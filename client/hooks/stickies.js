"use strict";

var stickyInsertHooks = {
    before: {
        insert: function (doc) {
            /* Extend our document (sticky) with a reference to the corresponding user story. */
            let storyId = Session.get('storyId');
            let story = UserStories.findOne({_id: storyId});
            if (story) doc.storyId = story._id;
            return doc;
        }
    },
    onSuccess: function (formType, result) {
        let sticky = Stickies.findOne({_id: result});
        let story = UserStories.findOne({_id: sticky.storyId});
        if (story && sticky) {
            let product = Products.findOne({_id: story.productId});
            if (product.advancedMode) {
                let sprint = Sprints.findOne({_id: story.sprintId});
                Meteor.call('updateBurndown', sprint._id, function (error) {
                    if (error) {
                        throwAlert('error', error.reason, error.details);
                        return;
                    }
                    Meteor.call('createActElStickyCreate', sticky.productId, Meteor.user()._id, sticky.title, story.title, sprint.goal, function (error) {
                        if (error) {
                            throwAlert('error', error.reason, error.details);
                            return;
                        }
                        throwAlert("success", "Success", "Sticky added.");
                    });
                });
            }
        }
    }
};

AutoForm.addHooks('insert-sticky-form', stickyInsertHooks);