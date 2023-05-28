<template>
    <svg viewBox="0 0 10 8"
         fill="none"
         xmlns="http://www.w3.org/2000/svg">
        <path d="M5.43301 7.25C5.24056 7.58333 4.75944 7.58333 4.56699 7.25L1.10289 1.25C0.910436 0.916669
            1.151 0.500001 1.5359 0.500001L8.4641 0.5C8.849 0.5 9.08956 0.916666 8.89711 1.25L5.43301 7.25Z"
              :fill="fill"
              stroke="currentColor"
        />
    </svg>
</template>

<script>
    export default {
        name: 'IconPinTriangle',

        props: {
            fill: {
                type: String,
                default: '#fff',
            }
        }
    };
</script>
