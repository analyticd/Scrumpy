"use strict";

var productsHooks = {
    onSuccess: function (formType, result) {
        Meteor.call('getProductSlug', result, function (error, response) {
            if (error) {
                throwAlert("error", error.reason, error.details);
                return;
            }
            DashboardStatisticsPrivate.insert({productId: result, data: []});
            Documents.insert({title: "Definition of Done", productId: result});
            Documents.insert({title: "Team availability", productId: result});
            Documents.insert({title: "Stakeholders", productId: result});
            Meteor.call('createActElProductCreate', result, Meteor.userId(), function (error) {
                if (error) {
                    throwAlert('error', error.reason, error.details);
                    return;
                }
                Meteor.call('createRole', result, Meteor.userId(), function (error) {
                    if (error) {
                        throwAlert('error', error.reason, error.details);
                        return;
                    }
                    Router.go('invite', {slug: response});
                });
            });
        });
    }
};

AutoForm.addHooks('insert-products-form', productsHooks);