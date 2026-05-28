package edu.cit.bibit.skillconnect.features.main

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.bibit.skillconnect.R
import edu.cit.bibit.skillconnect.features.common.SkillResponse

class SkillAdapter(
    private val skills: List<SkillResponse>,
    private val onItemClick: (SkillResponse) -> Unit
) : RecyclerView.Adapter<SkillAdapter.SkillViewHolder>() {

    class SkillViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvCategory: TextView = view.findViewById(R.id.tvSkillCategory)
        val tvTitle: TextView = view.findViewById(R.id.tvSkillTitle)
        val tvDesc: TextView = view.findViewById(R.id.tvSkillDesc)
        val tvProvider: TextView = view.findViewById(R.id.tvProviderName)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SkillViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_skill_card, parent, false)
        return SkillViewHolder(view)
    }

    override fun onBindViewHolder(holder: SkillViewHolder, position: Int) {
        val skill = skills[position]
        holder.tvCategory.text = skill.category.uppercase()
        holder.tvTitle.text = skill.title
        holder.tvDesc.text = skill.description
        holder.tvProvider.text = "Offered by: ${skill.providerName}"

        holder.itemView.setOnClickListener { onItemClick(skill) }
    }

    override fun getItemCount() = skills.size
}