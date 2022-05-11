<script>
	export let isoDate

	$: date = new Date(isoDate)

	function fmt_time(d) {
		return fmt_date(d) + ' ' + d.toLocaleTimeString()
	}
	function fmt_date(d) {
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
	}
</script>

<span title="{fmt_time(date)}">
	{fmt_date(date)}
</span>