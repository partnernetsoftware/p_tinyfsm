module.exports = async (init_opts,init_fsm,init_step_name) => {
	try{
		var {lgc,fsm,step_name} = init_fsm ? {lgc:init_opts,fsm:init_fsm,step_name:init_step_name} : (init_opts||{});
		var prev_sts,prev_rst,prev_name,pt,m;
		//auto parse fsm from str to obj:
		var fsm_o = (typeof fsm=='object') ? fsm : fsm.split(/[\n\r]+/).reduce(
			(r,e)=>(m=e.replace(/\s/g,'').match(/^(\w+)?(\.(\w*)=>(\w*))?/))&&(pt=m[1]||pt,pt&&(r[pt]=(r[pt]||{}),r[pt][m[3]]=m[4]),r),{}
		);
		if(!step_name){ for(var nm in fsm_o){ if(nm){step_name=nm; break}} }
		do{
			var func_p = lgc[step_name];
			if(func_p){
				var rst = await func_p(prev_rst,prev_name,prev_sts);
				var STS = (rst||{}).STS;
				step_next = (fsm_o[step_name]||{})[STS];
				if(!step_next) return rst;
				prev_name = step_name;
				step_name = step_next;
				prev_sts = STS;
				prev_rst = rst;
			}else return {STS:'KO',
				errmsg:((prev_name)?`${prev_name}.${prev_sts}`:'')+(`=>${step_name} not found?`)
			};
		}while(true);
	}catch(err){
		return {STS:'KO',errmsg:(''+err),err};
	}
};
