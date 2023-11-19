<script lang="ts">
    import {PUBLIC_GOOGLE_LOGIN_URL} from '$env/static/public'
    import './login.scss'
</script>
<div class="container">
    <!-- <input type="text" placeholder="email"> -->
    <button class="login-with-google-btn">
        <a href={PUBLIC_GOOGLE_LOGIN_URL}>LOGIN WITH GOOGLE</a>
    </button>
</div>