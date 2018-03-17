<table><tr><td bgcolor=#fbe7bc><font color='black'>

# 一、界面代码都没问题，但就是在系统中显示不出一闪而过
### 没有重新编译，WebUI中调用的.xap文件中依然时原来的代码

# 二、双击事件 
## xaml- RadGridView：  
    ctor:RowDoubleClickHandler.MethodName="InvokeEdit"
## viewModel:
     public override void InvokeEdit(object obj)
		{
			SetDialogParameters("工位模拟", typeof(StationASMProcess));
			base.InvokeEdit(obj);
		}
### 没编译

<font color='red' size=5> 记得编译、记得编译、记得编译</font>
# 三、static中不能使用this
### static（类型成员）不必实例化对象就可以被调用，而this（实例指针）是指向实例化对象的

# 四、在菜单信息界面的Bom查询节点下移除了向下展开、向上反查、展开至底、反查至顶等按钮，想要在添加在左侧却找不到了。在相应路径下放了图片不显示

</font></td></tr></table>