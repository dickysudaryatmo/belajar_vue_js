// new Vue({
//     el: '#app',
//     data () {
//         return {
//             info: null,
//             data: null
//         }
//     },
//     mounted () {
//         axios
//           .get('https://api.coindesk.com/v1/bpi/currentprice.json')
//           .then(response => (this.info = response))
//     },
//     methods: {
//         getData: function (event) {
//             this.data = this.info;
//         }
//     }

// })
 $('#settingsModal').modal({
        detachable: false,
        onVisible: function() {
            $('.ui.checkbox').checkbox()
        }
    }).modal('attach events', '#settingsBtn', 'show')

    var tableColumns = [
        {
            name: 'id',
            title: '',
            dataClass: 'center aligned',
            callback: 'showDetailRow'
        },
        {
          name: 'name',
          title: 'Full Name',
          sortField: 'name'
        },
        {
            name: 'email',
            sortField: 'email',
            visible: true
        },
        {
            name: 'nickname',
            sortField: 'nickname',
            callback: 'allCap'
        },
        {
            name: 'birthdate',
            sortField: 'birthdate',
            callback: 'formatDate|D/MM/Y'
        },
        {
            name: 'gender',
            sortField: 'gender',
            titleClass: 'center aligned',
            dataClass: 'center aligned',
            callback: 'gender'
        },
        {
            name: '__component:custom-action',
            title: "Component",
            titleClass: 'center aligned',
            dataClass: 'custom-action center aligned',
        },
        {
            name: '__actions',
            dataClass: 'center aligned',
        }
    ]

    Vue.config.debug = true

    var E_SERVER_ERROR = 'Error communicating with the server'


    Vue.component('custom-action', {
        template: [
            '<div>',
                '<button class="ui red button" @click="itemAction(\'view-item\', rowData)"><i class="zoom icon"></i></button>',
                '<button class="ui blue button" @click="itemAction(\'edit-item\', rowData)"><i class="edit icon"></i></button>',
                '<button class="ui green button" @click="itemAction(\'delete-item\', rowData)"><i class="delete icon"></i></button>',
            '</div>'
        ].join(''),
        props: {
            rowData: {
                type: Object,
                required: true
            }
        },
        methods: {
            itemAction: function(action, data) {
                sweetAlert('custom-action: ' + action, data.name)
            },
            onClick: function(event) {
                console.log('custom-action: on-click', event.target)
            },
            onDoubleClick: function(event) {
                console.log('custom-action: on-dblclick', event.target)
            }
        }
    })

    Vue.component('my-detail-row', {
        template: [
            '<div class="detail-row ui form" @click="onClick($event)">',
                '<div class="inline field">',
                    '<label>Name: </label>',
                    '<span>{{rowData.name}}</span>',
                '</div>',
                '<div class="inline field">',
                    '<label>Email: </label>',
                    '<span>{{rowData.email}}</span>',
                '</div>',
                '<div class="inline field">',
                    '<label>Nickname: </label>',
                    '<span>{{rowData.nickname}}</span>',
                '</div>',
                '<div class="inline field">',
                    '<label>Birthdate: </label>',
                    '<span>{{rowData.birthdate}}</span>',
                '</div>',
                '<div class="inline field">',
                    '<label>Gender: </label>',
                    '<span>{{rowData.gender}}</span>',
                '</div>',
            '</div>',
        ].join(''),
        props: {
            rowData: {
                type: Object,
                required: true
            }
        },
        methods: {
            onClick: function(event) {
                console.log('my-detail-row: on-click')
            }
        },
    })

    new Vue({
        el: '#app',
        data: {
            searchFor: '',
            moreParams: [],
            fields: tableColumns,
            sortOrder: [{
                field: 'name',
                direction: 'asc',
            }],
            multiSort: true,
            paginationComponent: 'vuetable-pagination',
            perPage: 10,
            // paginationInfoTemplate: 'แสดง {from} ถึง {to} จากทั้งหมด {total} รายการ',
            itemActions: [
                { name: 'view-item', label: '', icon: 'zoom icon', class: 'ui teal button' },
                { name: 'edit-item', label: '', icon: 'edit icon', class: 'ui orange button'},
                { name: 'delete-item', label: '', icon: 'delete icon', class: 'ui red button' }
            ]
        },
        watch: {
            'perPage': function(val, oldVal) {
                this.$broadcast('vuetable:refresh')
            },
            'paginationComponent': function(val, oldVal) {
                this.$broadcast('vuetable:load-success', this.$refs.vuetable.tablePagination)
            }
        },
        methods: {
            /**
            * Callback functions
            */
            allCap: function(value) {
                return value.toUpperCase()
            },
            gender: function(value) {
                return value == 'M'
                    ? '<span class="ui teal label"><i class="male icon"></i>Male</span>'
                    : '<span class="ui pink label"><i class="female icon"></i>Female</span>'
            },
            formatDate: function(value, fmt) {
                if (value == null) return ''
                fmt = (typeof fmt == 'undefined') ? 'D MMM YYYY' : fmt
                return moment(value, 'YYYY-MM-DD').format(fmt)
            },
            showDetailRow: function(value) {
                var icon = this.$refs.vuetable.isVisibleDetailRow(value) ? 'down' : 'right'
                return [
                    '<a class="show-detail-row">',
                        '<i class="chevron circle ' + icon + ' icon"></i>',
                    '</a>'
                ].join('')
            },
            setFilter: function() {
                this.moreParams = [
                    'filter=' + this.searchFor
                ]
                this.$nextTick(function() {
                    this.$broadcast('vuetable:refresh')
                })
            },
            resetFilter: function() {
                this.searchFor = ''
                this.setFilter()
            },
            changePaginationComponent: function() {
                this.$broadcast('vuetable:load-success', this.$refs.vuetable.tablePagination)
            },
            preg_quote: function( str ) {
                // http://kevin.vanzonneveld.net
                // +   original by: booeyOH
                // +   improved by: Ates Goral (http://magnetiq.com)
                // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // +   bugfixed by: Onno Marsman
                // *     example 1: preg_quote("$40");
                // *     returns 1: '\$40'
                // *     example 2: preg_quote("*RRRING* Hello?");
                // *     returns 2: '\*RRRING\* Hello\?'
                // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
                // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'

                return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
            },
            highlight: function(needle, haystack) {
                return haystack.replace(
                    new RegExp('(' + this.preg_quote(needle) + ')', 'ig'),
                    '<span class="highlight">$1</span>'
                )
            },
            rowClassCB: function(data, index) {
                return (index % 2) === 0 ? 'odd' : 'even'
            },
            // -------------------------------------------------------------------------------------------
            // You can change how sort params string is constructed by overriding getSortParam() like this
            // -------------------------------------------------------------------------------------------
            // getSortParam: function(sortOrder) {
            //     console.log('parent getSortParam:', JSON.stringify(sortOrder))
            //     return sortOrder.map(function(sort) {
            //         return (sort.direction === 'desc' ? '+' : '') + sort.field
            //     }).join(',')
            // }
        },
        events: {
            'vuetable:row-changed': function(data) {
                console.log('row-changed:', data.name)
            },
            'vuetable:row-clicked': function(data, event) {
                console.log('row-clicked:', data.name)
            },
            'vuetable:cell-clicked': function(data, field, event) {
                console.log('cell-clicked:', field.name)
                if (field.name !== '__actions') {
                    this.$broadcast('vuetable:toggle-detail', data.id)
                }
            },
            'vuetable:action': function(action, data) {
                console.log('vuetable:action', action, data)

                if (action == 'view-item') {
                    sweetAlert(action, data.name)
                } else if (action == 'edit-item') {
                    sweetAlert(action, data.name)
                } else if (action == 'delete-item') {
                    sweetAlert(action, data.name)
                }
            },
            'vuetable:load-success': function(response) {
                var data = response.data.data
                if (this.searchFor !== '') {
                    for (n in data) {
                        data[n].name = this.highlight(this.searchFor, data[n].name)
                        data[n].email = this.highlight(this.searchFor, data[n].email)
                    }
                }
            },
            'vuetable:load-error': function(response) {
                if (response.status == 400) {
                    sweetAlert('Something\'s Wrong!', response.data.message, 'error')
                } else {
                    sweetAlert('Oops', E_SERVER_ERROR, 'error')
                }
            }
        }
    })