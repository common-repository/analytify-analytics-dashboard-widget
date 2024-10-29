jQuery(document).ready(function ($) {

	// this object will keep track of all the xhr requests
	const xhrRequests = {};

	if ($('#analytify-dashboard-addon-hide').is(':checked')) {
		ajax_request(true);
	}

	$('#analytify-dashboard-addon-hide').on('click', function (event) {
		if ($(this).is(':checked')) {
			ajax_request(true);
		}
	});

	$('.analytify_form_date').on('submit', function (event) {
		event.preventDefault();
		// if ('inactive' === analytify_dashboard_widget.pro_active || 'false' === analytify_dashboard_widget.pro_updated) {
		// 	return false;
		// }
		// Clear the previous ajax requests before making any new requests.
		abortXHRRequest();
		ajax_request(true);
	});

	/**
	 * This function will abort all the xhr 
	 * requests other then the request for
	 * current selected section.
	 */
	function abortXHRRequest() {
		for (var key in xhrRequests) {
			if (xhrRequests.hasOwnProperty(key)) {
				xhrRequests[key].abort();
				delete xhrRequests[key];
			}
		}
	}

	/**
	 * Generates realtime box structure.
	 *
	 * @param {object|boolean} values Object of values, false will add a rand number.
	 *
	 * @returns {string}
	 */
	function realtime_box_structure(values = false) {
		let markup = ``;
		for (const key in analytify_dashboard_widget.real_time_labels) {
			const num = values ? values[key] ? values[key] : 0 : Math.floor(Math.random() * (100 - 10 + 1)) + 10;
			markup += `<div class="analytify_${key} analytify_realtime_status_boxes">`;
			markup += `<div class="analytify_general_stats_value" id="pa-${key}">${num}</div>`;
			markup += `<div class="analytify_label">${analytify_dashboard_widget.real_time_labels[key]}</div>`;
			markup += `</div>`;
		}
		return markup;
	}
	/**
	 * Sends the ajax call and generate the view.
	 *
	 * @returns {void}
	 */
	function ajax_request(clear_contents = true) {

		const stats_type = $('#analytify_dashboard_stats_type').val();

		if ('inactive' === analytify_dashboard_widget.pro_active && 'real-time-statistics' === stats_type) {
			event.stopPropagation();
			return false;
		}

		if ('false' === analytify_dashboard_widget.pro_active && 'real-time-statistics' === stats_type) {
			event.stopPropagation();
			return false;
		}

		const data = {
			sd: $('#analytify_date_start').val(),
			ed: $('#analytify_date_end').val(),
			differ: $('#analytify_widget_date_differ').val(),
		};

		if ('real-time-statistics' === stats_type) {
			data.type = 'counter';
		}

		const ajax_url = ('real-time-statistics' === stats_type) ? analytify_dashboard_widget.pro_url + 'real-time' : analytify_dashboard_widget.url + stats_type;

		xhrRequests[stats_type] = jQuery.ajax({
			url: ajax_url,
			type: 'get',
			data: data,
			beforeSend: function (xhr) {
				xhr.setRequestHeader('X-WP-Nonce', analytify_dashboard_widget.nonce);
				if (clear_contents) {
					$('#inner_analytify_dashboard').addClass('stats_loading');
					$('.analytify_widget_return_wrapper').html('');
				}
			},
			success: function (response) {

				$('#inner_analytify_dashboard').removeClass('stats_loading');

				let good_response = typeof response.success !== 'undefined' && response.success;
				let markup = '';

				if (good_response) {
					// Generate markup based on 'stats_type'.
					if ('general-statistics' === stats_type) {

						let boxes_markup = '';

						// Generate boxes.
						for (const box_key in response.boxes) {

							const box = response.boxes[box_key];

							boxes_markup += `<div class="analytify_general_status_boxes">
								<div class="title-wrapper">
									<div class="title-inner-wrapper">
										<h4>${box.title}</h4>
										${box.info ? `<div class="info-box"><span class="info-icon">?</span><p>${box.info}</p></div>` : ``}
									</div>
								</div>
								<div class="analytify_general_stats_value">${box.prepend ? box.prepend : ''}${box.number}${box.append ? box.append : ''}</div>
							</div>`;
						}

						if ('' !== boxes_markup) {
							markup += `<div class="analytify_status_header"><h3>${response.title}</h3></div>
							<div class="analytify_status_body">${boxes_markup}</div>
							<div class="analytify_status_footer"><span class="analytify_info_stats">${response.bottom_info}</span></div>`;
						}

					} else if ('top-pages-by-views' === stats_type || 'top-countries' === stats_type || 'top-cities' === stats_type || 'keywords' === stats_type || 'social-media' === stats_type || 'top-reffers' === stats_type) {

						let table_rows = '';
						let table_row_num = 1;
						// Generate table rows (excluding THs).
						for (const row_id in response.stats.data) {
							table_rows += `<tr>
								<td class="analytify_txt_center">${table_row_num}</td>
								<td>${response.stats.data[row_id][0]}</td>
								<td class="analytify_txt_center">${response.stats.data[row_id][1]}</td>
							</tr>`;
							table_row_num++;
						}

						if ('' !== table_rows) {

							const citiesPerPage = 'top-cities' === stats_type && analytify_dashboard_widget.top_cities_per_page !== undefined ? analytify_dashboard_widget.top_cities_per_page : false;

							markup += `<div class="analytify_status_header"><h3>${response.title}</h3></div>
							<div class="analytify_status_body">
								<table class="analytify_data_tables wp_analytify_paginated" ${citiesPerPage && 'data-product-per-page=' + citiesPerPage }>
									<thead>
										<tr>
											<th class="analytify_num_row">#</th>
											<th class="analytify_txt_left">${response.stats.head[0]}</th>
											<th class="analytify_value_row">${response.stats.head[1]}</th>
										</tr>
									</thead>
									<tbody>${table_rows}</tbody>
								</table>
							</div>`;

							if (response.bottom_info) {
								markup += `<div class="analytify_status_footer"><div class="wp_analytify_pagination"></div><span class="analytify_info_stats">${response.bottom_info}</span></div>`;
							}

						} else {
							markup = `<div class="analytify-stats-error-msg wpanalytify">
								<div class="wpb-error-box">
									<span class="blk"><span class="line"></span><span class="dot"></span></span>
									<span class="information-txt">${analytify_dashboard_widget.empty_message}</span>
								</div>
							</div>`;

						}

					} else if ('real-time-statistics' === stats_type) {

						markup = `<div class="analytify_status_header"><h3>${response.title}</h3></div>`;
						markup += `<div class="analytify_status_body"><div class="analytify_general_status_boxes_wraper analytify_real_time_stats_widget">${realtime_box_structure(response.counter)}</div></div>`;
					}
				} else if (response.message) {
					markup = `<div class="analytify-stats-error-msg wpanalytify">
						<div class="wpb-error-box">
							<span class="blk"><span class="line"></span><span class="dot"></span></span>
							<span class="information-txt">${response.message}</span>
						</div>
					</div>`;
				}

				$('.analytify_widget_return_wrapper').html(markup);

				// Call pagination from the core.
				if (good_response && response.pagination) {
					wp_analytify_paginated();
				}

				$(window).trigger('resize');

			}
		});
	}

	if ('inactive' === analytify_dashboard_widget.pro_active || 'false' === analytify_dashboard_widget.pro_updated) {
		$(document).on('change', '#analytify_dashboard_stats_type', function (e) {
			if ('real-time-statistics' === $(this).val()) {
				$('#analytify-dashboard-addon .analytify_widget_return_wrapper').hide();
				let markup = '';

				markup += `<div class="analytify-dashboard-promo">
					${realtime_box_structure(false)}
					${analytify_dashboard_widget.real_time_pro_message}
				</div>`;

				$(markup).insertAfter('#analytify-dashboard-addon .analytify_widget_return_wrapper');

			} else {
				$('#analytify-dashboard-addon .analytify_widget_return_wrapper').show();
				$('.analytify-dashboard-promo').remove();
			}
			$(window).trigger('resize');
		});
	}

	if ('active' === analytify_dashboard_widget.pro_active && 'true' === analytify_dashboard_widget.pro_updated) {
		setInterval(() => {
			if (
				'real-time-statistics' === $('#analytify_dashboard_stats_type').val()
				&&
				$('#analytify-dashboard-addon-hide').is(':checked')
			) {
				// Clear the previous ajax requests before making any new requests.
				abortXHRRequest();
				ajax_request(false);
			}
		}, 30000);
	}

});
