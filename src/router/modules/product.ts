// 导入组件
import brand from "@/views/product/brand.vue";
import categoryBrand from "@/views/product/categoryBrand.vue";
import productSpec from "@/views/product/productSpec.vue";
import product from "@/views/product/product.vue";

const Layout = () => import('@/layout/index.vue');
const category = () => import('@/views/product/category.vue');

const productRouter = {
  path: '/product',
  component: Layout,
  name: 'product',
  meta: {
    title: '商品管理',
    icon: 'table'
  },
  children: [
    {
      path: '/category',
      name: 'category',
      component: category,
      meta: {
        title: '分类管理'
      },
      hidden: false
    },
    {
      path: '/brand',
      name: 'brand',
      component: brand,
      meta: {
        title: '品牌管理'
      },
      hidden: false
    },
    {
      path: '/categoryBrand',
      name: 'categoryBrand',
      component: categoryBrand,
      meta: {
        title: '分类品牌管理'
      },
      hidden: false
    },
    {
      path: '/productSpec',
      name: 'productSpec',
      component: productSpec,
      meta: {
        title: '分类品牌管理'
      },
      hidden: false
    },
    {
      path: '/product',
      name: 'product',
      component: product,
      meta: {
        title: '商品管理'
      },
      hidden: false
    },
  ]
};
export default productRouter;
