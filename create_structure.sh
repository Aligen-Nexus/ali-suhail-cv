#!/bin/bash
mkdir -p assets/css assets/js assets/images components pages
touch pages/{index,about,services,pricing,faq,contact,privacy,terms,login,register,forgot-password,reset-password,verify-email,2fa,dashboard,profile,settings,notifications,messages,activity,billing,admin-dashboard,admin-users,admin-roles,admin-products,admin-orders,admin-content,admin-pages,admin-settings,admin-reports,admin-logs,products,product-details,categories,wishlist,cart,checkout,track-order,my-orders,chat,image-generator,text-generator,file-analysis,history,ai-models,loading,404,403,500,maintenance,offline,success,failed}.html
touch assets/css/{style,dashboard,auth}.css
touch assets/js/{app,dashboard}.js
touch components/{navbar,sidebar,footer,modal,loader}.html
echo 'تم إنشاء الهيكلية بنجاح!'
