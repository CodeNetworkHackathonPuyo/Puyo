<html>
<title>Puyo Puyo</title>
<?php include "_includes/head.php"; ?>
<?php include "_includes/header.php"; ?>

<body class="page">
    <?php include "_includes/nav.php"; ?>

    <div class="content">
        <h1>Puyo Puyo</h1>
        <div>
        <section class=''>
        <img id='sonic' src='<?=$site?>/_images/sonic.png' />
        <button class='retry' ><a href="">Retry</a></button>

        <canvas id="canvas"></canvas>

        </section>
        </div>
        <div id='controls'>
        Arrow keys - Movement <br>
        S - Rotate Counter Clockwise <br>
        D - Rotate Clockwise <br>
        Space - Drop
        </div>
    </div>
    <?php include "_includes/footer.php"; ?>
</body>
</html>
