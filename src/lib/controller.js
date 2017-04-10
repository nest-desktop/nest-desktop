"use strict"

var controller = {};

controller.init = function() {
    $('#global .content').empty()
    var modelDefaults = app.config.nest('global')
    for (var midx in modelDefaults) {
        var model = modelDefaults[midx];
        model.value = app.data[model.id];
        app.slider.init_globalSlider(model)
    }

    $('#kernel .content').empty()
    var modelDefaults = app.config.nest('kernel')
    for (var midx in modelDefaults) {
        var model = modelDefaults[midx];
        model.value = app.data.kernel[model.id];
        app.slider.init_kernelSlider(model)
    }

    var colors = app.chart.colors();
    var borderWidth = '4px';

    var nodeDefaults = app.config.nest('node');
    $('#nodes .controller').empty()
    $('#nodeScrollspy .nav').empty()
    app.data.nodes.map(function(node) {
        // if (node.hidden) return
        $('#nodes .controller').append(app.renderer.node(node))
        var divNode = $('#nodes').find('.node[data-id=' + node.id + '] .content')
        var modelDefaults = app.config.nest(node.element_type);
        for (var midx in modelDefaults) {
            var model = modelDefaults[midx];
            divNode.find('.modelSelect').append('<option id="' + model.id + '" value="' + model.id + '">' + model.label + '</option>')
        }
        divNode.find('option#' + node.model).prop('selected', true);
        divNode.find('.modelSelect').toggleClass('disabled', node.disabled || false)
        divNode.find('.glyphicon-remove').toggle(node.disabled || false)
        divNode.find('.glyphicon-ok').toggle(!node.disabled && true)
        // divNode.find('.modelSelect').prop('disabled', node.disabled || false)
        if (node.disabled) return

        $('#nodeScrollspy .nav').append(app.renderer.scrollspy(node))
        if (node.element_type == 'neuron' || node.element_type == 'stimulator') {
            nodeDefaults.npop.value = node.n || 1
            app.slider.init_popSlider(node, nodeDefaults.npop)
        }
        if (node.element_type == 'stimulator') {
            nodeDefaults.stim_time.max = app.data.sim_time
            nodeDefaults.stim_time.value = [(node.params.start || 0), (node.params.stop || app.data.sim_time)]
            app.slider.init_stimSlider(node, nodeDefaults.stim_time)
        }
        if (node.model == 'spike_detector') {
            nodeDefaults.nbins.value = nodeDefaults.nbins.ticks_labels.indexOf(node.nbins) || 1
            app.slider.init_binSlider(node, nodeDefaults.nbins)
        }
        var colors = app.chart.colors();
        $('.node[data-id=' + node.id + '] .slider-selection').css('background', colors[node.id % colors.length])
        $('.node[data-id=' + node.id + '] .slider-handle').css('border', '2px solid ' + colors[node.id % colors.length])

        if (node.model) {
            app.slider.init_modelSlider('#nodes .node[data-id=' + node.id + '] .modelSlider', modelDefaults.filter(function(d) {
                return d.id == node.model;
            })[0])
            if (modelDefaults.params) {
                modelDefaults.params.map(function(param) {
                    $('#nodes .node[data-id=' + node.id + ']').append('<div id="' + param.id + '" class="form-group"></div>')
                    $('#nodes .node[data-id=' + node.id + '] #' + param.id).append('<label for="' + param.id + 'Input"/>' + param.label + '</label>')
                    $('#nodes .node[data-id=' + node.id + '] #' + param.id).append('<input type="text" class="form-control" name="' + param.id + '" id="' + param.id + 'Input"/>')
                })
            }

        }
        if (node.element_type == 'recorder') {
            if (node.model == 'multimeter') {
                divNode.append('<div class="recSelect form-group hideOnDrawing"></div>')
                divNode.find('.recSelect').append('<label for="record_' + node.id + '">Record from</label>')
                divNode.find('.recSelect').append('<select id="record_' + node.id + '" class="record form-control"></select>')
            }
        }
        app.slider.update_nodeSlider(node)
    })

    var drawing = app.chart.networkLayout.drawing;
    if (!drawing) {
        $('#connections .controller').empty();
        $('#synapses .controller').empty();
        app.data.links.map(function(link) {
            if (app.data.nodes[link.source].hidden || app.data.nodes[link.target].hidden) return
            if (app.data.nodes[link.source].disabled || app.data.nodes[link.target].disabled) return
            // if (app.data.nodes[link.target].element_type == 'recorder') return

            // Connection
            $('#connections .controller').append(app.renderer.connection(link))
            var divConnLink = $('#connections').find('.link[data-id=' + link.id + '] .content')
            var modelDefaults = app.config.nest('connection')
            for (var midx in modelDefaults) {
                var model = modelDefaults[midx];
                divConnLink.find('.connSelect').append('<option id="' + model.id + '" value="' + model.id + '">' + model.label + '</option>')
            }
            var connRule = (link.conn_spec ? (link.conn_spec.rule || 'all_to_all') : 'all_to_all')
            divConnLink.find('.connSelect').find('option#' + connRule).prop('selected', true);
            divConnLink.find('.modelSelect').toggleClass('disabled', link.disabled || false)
            divConnLink.find('.glyphicon-remove').toggle(link.disabled || false)
            divConnLink.find('.glyphicon-ok').toggle(!link.disabled && true)
            if (link.disabled) return

            app.slider.init_modelSlider('#connections .link[data-id=' + link.id + '] .modelSlider', modelDefaults.filter(function(d) {
                return d.id == connRule;
            })[0])
            app.slider.update_connSlider(link)

            // Synapse
            $('#synapses .controller').append(app.renderer.synapse(link))
            var divSynLink = $('#synapses').find('.link[data-id=' + link.id + '] .content')

            var synapseModels = app.config.nest('synapse')
            for (var midx in synapseModels) {
                var model = synapseModels[midx];
                divSynLink.find('.synSelect').append('<option id="' + model.id + '" value="' + model.id + '">' + model.label + '</option>')
            }
            var synapseModel = (link.syn_spec ? (link.syn_spec.model || 'static_synapse') : 'static_synapse')
            divSynLink.find('.synSelect').find('option#' + synapseModel).prop('selected', true);

            // delete link.syn_spec.receptor_type
            if (app.data.nodes[link.target].model == 'iaf_cond_alpha_mc') {
                var receptorModels = app.config.nest('receptor')['iaf_cond_alpha_mc']
                if (!('receptor_type' in link.syn_spec) || link.syn_spec.receptor_type == 0) {
                    link.syn_spec.receptor_type = 1
                }
                divSynLink.find('.recSelect').empty()
                for (var ridx in receptorModels) {
                    var model = receptorModels[ridx];
                    divSynLink.find('.recSelect').append('<option id="' + ridx + '" value="' + model.id + '"' + (model.id == 1 ? 'selected' : '') + '>' + model.label + '</option>')
                }
                $('#synapses').find('.link[data-id=' + link.id + '] .content').find('.recSelect').show()
            } else {
                link.syn_spec.receptor_type = 0
            }

            divSynLink.find('.recSelect').on('change', function() {
                app.simulation.run(false)
                app.selected_link = app.data.links[$(this).parents('.link').data('id')];
                app.selected_link.syn_spec.receptor_type = parseInt(this.value)
                app.simulation.simulate()
            })

            app.slider.init_modelSlider('#synapses .link[data-id=' + link.id + '] .modelSlider', synapseModels.filter(function(d) {
                return d.id == synapseModel;
            })[0])
            app.slider.update_synSlider(link)

        })
    }
    $('.hideOnDrawing').toggle(!drawing)

    // app.slider.init_dataSlider()
    // data.nodes.map(function(node) {
    //     if (node.model) {
    //         app.models.model_selected(node)
    //     }
    // })

    app.events.controller()
}

module.exports = controller;
