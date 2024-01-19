export default function (context, options) {
  return {
    name: 'koala-plugin',
    loadContent: async () => {
      return {remoteHeadTags: await fetchHeadTagsFromAPI()};
    },
    injectHtmlTags({content}) {
      return {
       postBodyTags: [`<script>
!function(t){if(window.ko)return;window.ko=[],["identify","track","removeListeners","open","on","off","qualify","ready"].forEach(function(t){ko[t]=function(){var n=[].slice.call(arguments);return n.unshift(t),ko.push(n),ko}});var n=document.createElement("script");n.async=!0,n.setAttribute("src","https://cdn.getkoala.com/v1/pk_e6dc04f84fc4ee708227c1b3976e5b2ca7b8/sdk.js"),(document.body || document.head).appendChild(n)}();
</script>`],
      };
    },
  };
}
