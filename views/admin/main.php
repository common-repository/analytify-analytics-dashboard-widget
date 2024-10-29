<?php
// Exit if accessed directly
if (! defined('ABSPATH')) {
    exit;
}
?>
<div class="analytify_wraper">
	<div class="analytify-activation-card-header">
		<img src="<?php echo ANALYTIFY_WIDGET_PATH . 'assets/images/logo.svg'; ?>">
	</div>
	<div class="analytify-widget-form">
		<div class="analytify_main_setting_bar">
			<div class="analytify_setting">
				<div class="analytify_select_date">
					<form class="analytify_form_date" action="" method="post">
						<div class="analytify_select_date_fields">
							<input type="hidden" name="st_date" id="analytify_start_val">
							<input type="hidden" name="ed_date" id="analytify_end_val">
							<input type="hidden" name="analytify_widget_date_differ" id="analytify_widget_date_differ">

							<input type="hidden" name="analytify_date_start" id="analytify_date_start" value="<?php echo $date['start']; ?>">
							<input type="hidden" name="analytify_date_end" id="analytify_date_end" value="<?php echo $date['end']; ?>">

							<label for="analytify_start"><?php _e('From:', 'analytify-analytics-dashboard-widget'); ?></label>
							<input type="text" required id="analytify_start" value="">
							<label for="analytify_end"><?php _e('To:', 'analytify-analytics-dashboard-widget'); ?></label>
							<input type="text" onpaste="return: false;" oncopy="return: false;" autocomplete="off" required id="analytify_end" value="">

							<div class="analytify_arrow_date_picker"></div>
						</div>
						<div class="analytify-dashboard-stats-opts">
							<select  id="analytify_dashboard_stats_type">
								<option value="general-statistics"><?php analytify_e('General Statistics', 'analytify-analytics-dashboard-widget'); ?></option>
								<option value="real-time-statistics"><?php analytify_e('Real-Time', 'analytify-analytics-dashboard-widget'); ?></option>
								<option value="top-pages-by-views"><?php _e('Top Pages', 'analytify-analytics-dashboard-widget'); ?></option>
								<option value="top-countries"><?php _e('Top Countries', 'analytify-analytics-dashboard-widget'); ?></option>
								<option value="top-cities"><?php _e('Top Cities', 'analytify-analytics-dashboard-widget'); ?></option>
								<option value="keywords"><?php _e('Keywords', 'analytify-analytics-dashboard-widget'); ?></option>
								<?php if ('ga3' === $ga_mode) { ?><option value="social-media"><?php analytify_e('Social Media', 'analytify-analytics-dashboard-widget'); ?></option><?php } ?>
								<option value="top-reffers"><?php analytify_e('Top Referrers', 'analytify-analytics-dashboard-widget'); ?></option>
							</select>
							<input type="submit" value="<?php _e('View Stats', 'analytify-analytics-dashboard-widget'); ?>" name="view_data" class="analytify_submit_date_btn">
						</div>
						<?php echo WPANALYTIFY_Utils::get_date_list(); ?>
					</form>
				</div>
			</div>
		</div>
		<div class="analytify-dashboard-inner">
			<div class="analytify_wraper">
				<div id="inner_analytify_dashboard" class="stats_loading">
					<div class="analytify_general_status analytify_status_box_wraper analytify_widget_return_wrapper"></div>
				</div>
			</div>
		</div>
	</div>
	<?php echo $footer; ?>
</div>
