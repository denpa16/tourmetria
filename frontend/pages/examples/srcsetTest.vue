<template>
    <div :class="['page', $style.SrcsetTest]">
        <div class="container">
            <div :class="$style.mainImage">
                <VImageSrcSet
                    alt="Проект"
                    image="https://template.idacloud.ru/images/projectsDemo/zhk-erofeev.png"
                    :width="{m: 375, t: 768, d: 1920}"
                    :height="{m: 436, t: 408, d: 568}"
                    :quality="{ img: 100, preview: 20 }"
                />
            </div>
        </div>
    </div>
</template>

<script>


/**
 * @version 1.0.2
 * @displayName ProjectsFilterPage
 */
export default {
    name: 'SrcsetTest',
};
</script>

<style lang="scss" module>
    .SrcsetTest {
        //
    }

    .mainImage {
        width: 100%;
        height: 60rem;
    }
</style>
