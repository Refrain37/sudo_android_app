<script>
    import {checkNetwork} from 'utils/index.js'
    
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
            checkNetwork()
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*public style */
    @import url("./common/css/index.css");
    @import url("./common/css/iconfont.css");
</style>
