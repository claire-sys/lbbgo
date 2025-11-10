
    (function() {
      var cdnOrigin = "https://cdn.shopify.com";
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills.Ba0kryUm.js","/cdn/shopifycloud/checkout-web/assets/c1/app.owqgWGYv.js","/cdn/shopifycloud/checkout-web/assets/c1/locale-en.dFhRK3ZO.js","/cdn/shopifycloud/checkout-web/assets/c1/page-OnePage.BwIC0RmZ.js","/cdn/shopifycloud/checkout-web/assets/c1/LocalizationExtensionField.C5_Vy5Jg.js","/cdn/shopifycloud/checkout-web/assets/c1/ShopPayOptInDisclaimer.Bl8MpR5A.js","/cdn/shopifycloud/checkout-web/assets/c1/PaymentButtons.BvmHXI7E.js","/cdn/shopifycloud/checkout-web/assets/c1/StockProblemsLineItemList.BB0TP4oM.js","/cdn/shopifycloud/checkout-web/assets/c1/DeliveryMethodSelectorSection.OYHsyxh8.js","/cdn/shopifycloud/checkout-web/assets/c1/useEditorShopPayNavigation.Ua6ZvAgB.js","/cdn/shopifycloud/checkout-web/assets/c1/VaultedPayment.Bfd-gj_8.js","/cdn/shopifycloud/checkout-web/assets/c1/Section.DrGY8mUP.js","/cdn/shopifycloud/checkout-web/assets/c1/SeparatePaymentsNotice.CGfInKQt.js","/cdn/shopifycloud/checkout-web/assets/c1/ShipmentBreakdown.BzI7UU4M.js","/cdn/shopifycloud/checkout-web/assets/c1/MerchandiseModal.bIS5cY44.js","/cdn/shopifycloud/checkout-web/assets/c1/StackedMerchandisePreview.C60CsUJD.js","/cdn/shopifycloud/checkout-web/assets/c1/component-ShopPayVerificationSwitch.XT3c0jAa.js","/cdn/shopifycloud/checkout-web/assets/c1/useSubscribeMessenger.Bkh-o6J2.js","/cdn/shopifycloud/checkout-web/assets/c1/index.CZo637rF.js","/cdn/shopifycloud/checkout-web/assets/c1/PayButtonSection.Byh3Erve.js"];
      var styles = ["/cdn/shopifycloud/checkout-web/assets/c1/assets/app.CETVp4gZ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OnePage.Dx_lrSVd.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/DeliveryMethodSelectorSection.BvrdqG-K.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useEditorShopPayNavigation.CBpWLJzT.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/VaultedPayment.OxMVm7u-.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Section.ClWBj0Dy.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/StackedMerchandisePreview.CKAakmU8.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShopPayVerificationSwitch.WW3cs_z5.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0938/2690/8470/files/Untitled_design_16_x320.png?v=1755781935"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [cdnOrigin].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  