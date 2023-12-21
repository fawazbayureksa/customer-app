export const cartCheckoutGetDataShown = data => {
  // ============================== Check PWP ==============================
  let data_shown = [];

  for (const datum of data) {
    let mapForCart = {};
    let mapForPwp = {};

    for (const cart of datum.carts) {
      // ===================================== Check for pwp detail =====================================
      if (
        cart.mp_product.mp_product_pwp_detail &&
        cart.mp_product.mp_product_pwp_detail.mp_product_pwp_id
      ) {
        if (
          !mapForCart[cart.mp_product.mp_product_pwp_detail.mp_product_pwp_id]
        ) {
          mapForCart[cart.mp_product.mp_product_pwp_detail.mp_product_pwp_id] =
            [];
        }
        mapForCart[
          cart.mp_product.mp_product_pwp_detail.mp_product_pwp_id
        ].push(cart);
      } else {
        if (!mapForCart[0]) {
          mapForCart[0] = [];
        }
        mapForCart[0].push(cart);
      }
      // ===================================== Check for pwp parent =====================================
      if (cart.mp_product.mp_product_pwp && cart.mp_product.mp_product_pwp.id) {
        mapForPwp[cart.mp_product.mp_product_pwp.id] =
          cart.mp_product.mp_product_pwp;
      }
    }

    data_shown.push({
      ...datum,
      mapForCart: mapForCart,
      mapForPwp: mapForPwp,
    });
  }
  return data_shown;
};

export const cartCheckoutGetDataShown2 = (
  data,
  selected_ids,
  voucherCustomers,
) => {
  // ============================== Prepare vouchers ==============================
  let voucherStructs = prepareVouchers(data, voucherCustomers);
  console.log(JSON.parse(JSON.stringify(voucherStructs)));
  // ============================== Check PWP ==============================
  let data_shown = [];
  for (const datum of data) {
    let new_carts = [];
    for (const pwpID in datum.mapForCart) {
      // ===================================== Check is satisfy conditions =====================================
      let main_is_satisfied = false;
      let satisfied_non_mains = 0;
      for (const x of datum.mapForCart[pwpID]) {
        let pwp_detail = x.mp_product.mp_product_pwp_detail;
        if (pwp_detail) {
          if (datum.mapForPwp[pwp_detail.mp_product_pwp_id]) {
            if (selected_ids.indexOf(x.id) >= 0) {
              if (x.quantity >= pwp_detail.min_qty) {
                if (pwp_detail.is_main) {
                  main_is_satisfied = true;
                } else {
                  satisfied_non_mains++;
                }
              }
            }
          }
        }
      }
      // ===================================== Create discount if satisfy =====================================
      if (
        datum.mapForPwp[pwpID] &&
        main_is_satisfied &&
        satisfied_non_mains >= datum.mapForPwp[pwpID].min_child_type
      ) {
        let total_discount = 0;
        let child_that_got_discount = 0;
        let main_that_got_discount = 0;
        for (const x of datum.mapForCart[pwpID]) {
          let pwp_detail = x.mp_product.mp_product_pwp_detail;
          if (pwp_detail) {
            if (pwp_detail.is_main && main_that_got_discount >= 1) {
              continue;
            } else if (
              !pwp_detail.is_main &&
              child_that_got_discount >= datum.mapForPwp[pwpID].max_child_type
            ) {
              continue;
            }
            if (selected_ids.indexOf(x.id) >= 0) {
              if (x.quantity >= pwp_detail.min_qty) {
                let discount_amount_per_item = calculateDiscountByTypeForPwp(
                  pwp_detail.discount_type,
                  x.mp_product_sku.price,
                  pwp_detail.discount,
                  pwp_detail.max_discount,
                );
                // calculate discount times max quantity and total cannot be greater than price
                let discount = Math.min(
                  discount_amount_per_item *
                    Math.min(x.quantity, pwp_detail.max_qty),
                  x.mp_product_sku.price,
                );
                console.log(pwp_detail, discount_amount_per_item, discount);
                total_discount += discount;
                if (pwp_detail.is_main) {
                  main_that_got_discount++;
                } else {
                  child_that_got_discount++;
                }
              }
            }
          }
        }
        new_carts.push({
          id: pwpID,
          type: 'pwp',
          active: true,
          min_child_type: datum.mapForPwp[pwpID].min_child_type,
          max_child_type: datum.mapForPwp[pwpID].max_child_type,
          total_discount: total_discount,
          items: datum.mapForCart[pwpID],
        });
      } else if (datum.mapForPwp[pwpID]) {
        new_carts.push({
          id: pwpID,
          type: 'pwp',
          active: false,
          min_child_type: datum.mapForPwp[pwpID].min_child_type,
          max_child_type: datum.mapForPwp[pwpID].max_child_type,
          total_discount: 0,
          items: datum.mapForCart[pwpID],
        });
      } else {
        new_carts.push({
          id: pwpID,
          type: 'general',
          items: datum.mapForCart[pwpID],
          total_discount: 0,
        });
      }
    }

    // ========================================== Apply vouchers ==========================================
    if (voucherStructs.length > 0) {
      for (let new_cart of new_carts) {
        let shipping_fee = 0;
        if (datum.courier_type_selected) {
          shipping_fee = datum.courier_type_selected.cost.value;
        }
        new_cart.total_discount += calculateVoucher(
          voucherStructs,
          datum.seller.id,
          new_cart,
          shipping_fee,
          selected_ids,
        );
      }
    }

    data_shown.push({
      ...datum,
      carts: new_carts,
    });
  }
  console.log(data_shown);
  return data_shown;
};
