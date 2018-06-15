<template>
    <div>
        <textarea cols="30" rows="10" v-bind:value="html"></textarea>
        <pre class="prettyprint" v-html="prettyPrintHtml(html)"></pre>
        <button v-show="hasClipboardSupport" v-on:click.prevent="copyHtml" type="button" class="btn btn-default">
            <span class="glyphicon glyphicon-copy" aria-hidden="true"></span>
        </button>
    </div>
</template>

<script>

    import Vue from 'vue'
    import _ from 'lodash';

    import * as constants from '../modules/constants';
    import tagPropertyMappings from '../modules/TagPropertyMappings';

    export default {

        props: [
            'type',
            'altVariantUrl',
            'viewPortWidth',
            'breakOnType',
            'preservePages',
            'preserveFragment',
            'preserveQuery',
            'forceHttps',
            'redirectPreview',
            'avoidReRedirects',
            'shouldLog'
        ],

        computed: {
            breakOn () {
                switch (this.breakOnType) {
                    case constants.BREAK_TYPE_VIEW_PORT:
                        return "view-port";
                    case constants.BREAK_TYPE_TOUCH_EVENTS:
                        return "touch";
                    case constants.BREAK_TYPE_USER_AGENT:
                        return "user-agent";
                    default:
                        return null;
                }
            },

            html () {
                const dataPrefix = 'data-',
                    indent = '    ',
                    script = 'script';

                let content = `<${script}\n${indent}id=\"ceros-variant-redirect\"\n`;

                content += `${indent}src=\"${constants.URL_PLUGIN_SRC}\"\n`;
                content += `${indent}${dataPrefix}redirect-from=\"${this.type}\"\n`;
                content += `${indent}${dataPrefix}redirect-to=\"${this.altVariantUrl}\"\n`;
                content += `${indent}${dataPrefix}break-on=\"${this.breakOn}\"\n`;

                if (this.breakOnType === constants.BREAK_TYPE_VIEW_PORT) {
                    content += `${indent}${dataPrefix}min-width=\"${this.viewPortWidth}\"\n`;
                }

                tagPropertyMappings.forEach(function (tagMapping) {

                    if (this[tagMapping.propName] != tagMapping.default) {

                        const yesOrNo = (this[tagMapping.propName] === true) ? 'yes' : 'no';

                        content += `${indent}${dataPrefix}${tagMapping.attributeName}=\"${yesOrNo}\"\n`;

                    }

                }.bind(this));

                return content + `/></${script}>`;
            },

            hasClipboardSupport () {
                return (document.queryCommandSupported && document.queryCommandSupported('copy'));
            }

        },

        methods: {
            prettyPrintHtml (value) {
                return prettyPrintOne(
                    _.escape(value)
                );
            },

            copyHtml () {

                const textArea = this.$el.querySelector("textarea");

                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.blur();

            }
        }
    }

</script>

<style scoped="true">
    textarea {
        position: absolute;
        top:  -9999999px;
        left: -9999999px;
    }

    button {
        position: absolute;
        bottom: 15px;
        right: 20px;
    }
</style>
