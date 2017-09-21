/*
 data-preserve-page=&quot;yes&quot;</span><span v-if="preserveFragment">
 data-preserve-fragment=&quot;yes&quot;</span><span v-if="preserveQuery">
 data-preserve-query=&quot;yes&quot;</span><span v-if="forceHttps">
 data-force-https=&quot;yes&quot;</span><span v-if="redirectPreview">
 data-redirect-preview=&quot;yes&quot;</span><span v-if="avoidReRedirects === false">
 data-avoid-re-redirects=&quot;no&quot;</span><span v-if="shouldLog">
 data-should-log=&quot;yes&quot;</span>

 */

export default [
    {propName: "preservePages", attributeName: "preserve-page", default: false},
    {propName: "preserveFragment", attributeName: "preserve-fragment", default: false},
    {propName: "preserveQuery", attributeName: "preserve-query", default: false},
    {propName: "forceHttps", attributeName: "force-https", default: false},
    {propName: "redirectPreview", attributeName: "redirect-preview", default: false},
    {propName: "avoidReRedirects", attributeName: "avoid-re-redirects", default: true},
    {propName: "shouldLog", attributeName: "should-log", default: false}
];