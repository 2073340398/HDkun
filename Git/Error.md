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

<table><tr><td bgcolor="a8b6bf"><font color='black'>

![Alt text](488341.jpg "optional title")

#  <font color="#4080d0">佳时特</font>

<hr color="green">

项目=零件:

>生产一批零件就是一个项目

>一个项目对应多个任务 一个任务又有多个工艺 一个工艺有多个工序

>打印报错unable to create virtual...
>>将服务器属性中的web修改为use local iis web server 去掉use iis express复选框
>>>silverlight无法调试问题在debuggers中勾选silverlight复选框

>连不到服务器 网线被踢掉了

<hr color="green">

## <font color="blue">计划查询</font>
### PlanSearchASMViewModel》PlanSearchAsmDetail
### 1、CreateUI、CreateFilterDescriptorsForAppendix负责创建主UI
### 2、InvokeLoadingRowDetails负责生成子gridView
### 3、ShowDetails负责查询界面

## <font color="blue">报表打印</font>
### 2、判断是否选中数据》遍历选中数据》(添加报表打印按钮，按下打印按钮判断是否选中、判断生产订单是否为空、根据生产订单号查询数据、判断是否发料、EF_CHAR3是否为空、根据item_id和EF_CHAR3查询数据、判断数据是否为空、将数据写入list集合中、根据表SRA_LAYOUT_PAGE中数据打印相关报表)
### 3、pm_plan_master中EF_Char3为空，jm在新建订单时没有选取工艺路线的下拉框，手动在WebUI.DataServices PmPlanMater下达与撤销中添加了m_PM_PLAN_MASTER.EF_CHAR3 = m_PM_ROUTING_DETAIL.ROUTING_NO;

<hr color="green">

数控计划维护中含有精密数据

        1、ef_char2有三种数据（Dispersed、5118F45A88A65BA0）、空，

        2、company_code中有三种（SKMES、空）、JMMES

                    DispersedFilter.PropertyName = PmPlanMasterProperty.EF_CHAR2;
			DispersedFilter.Operation = FilterOperation.IsNotNull;

在登录界面选择了精密 进的依然是数控界面

添加工艺路线 输入工艺后 想删除前面一条工艺 全部工艺都会被删除

* 数据分组排列使用到了ObservableCollection<T>

</font></td></tr></table>

