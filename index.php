<html>
<title>Puyo Puyo</title>
<?php include "_includes/head.php"; ?>
<?php include "_includes/header.php"; ?>

<body class="page">
    <?php include "_includes/nav.php"; ?>

    <div class="content">
        <h1>Puyo Puyo</h1>
        <section class=''>
        <button class='retry' ><a href="">Retry</a></button>

        <?php for ($i = 0; $i < count($skins); $i++): ?>
            <img id='<?=$skins[$i]?>' src='<?=$site?>/_images/<?=$skins[$i]?>.png' />
        <?php endfor; ?>

        <canvas id="canvas"></canvas>

        <button class='left mobile'>Left</button>
        <button class='right mobile'>Right</button>
        <button class='drop mobile'>Drop</button>
        <button class='rotate mobile'>Rotate</button>

        </section>
    </div>
    <?php include "_includes/footer.php"; ?>
</body>
</html>
